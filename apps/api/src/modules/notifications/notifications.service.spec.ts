/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

// Mock node:fs and firebase-admin BEFORE importing the service.
jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));
import * as fs from 'node:fs';
const mockedFs = fs as jest.Mocked<typeof fs>;

const sendMock = jest.fn();
const initializeAppMock = jest.fn();
const certMock = jest.fn(() => ({}));
const appMock = jest.fn();
const messagingMock = jest.fn(() => ({ send: sendMock }));

jest.mock('firebase-admin', () => ({
  apps: [] as unknown[],
  initializeApp: initializeAppMock,
  credential: { cert: certMock },
  messaging: messagingMock,
  app: appMock,
  SDK_VERSION: 'mock',
}));

import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SMS_LOG_STATUS } from './notifications.constants';

const SMS_CONFIG_LIVE = {
  'sms.apiKey': 'live-key',
  'sms.username': 'sandbox',
  'sms.senderId': 'BARTAL',
  'fcm.serviceAccountPath': '',
};
const SMS_CONFIG_LIVE_PROD = {
  ...SMS_CONFIG_LIVE,
  'sms.username': 'my-prod-account',
};
const SMS_CONFIG_STUB = {
  'sms.apiKey': '',
  'sms.username': 'sandbox',
  'sms.senderId': 'BARTAL',
  'fcm.serviceAccountPath': '',
};

function makeAtRecipient(overrides: Partial<{ statusCode: number; status: string; messageId: string; cost: string }> = {}) {
  return {
    statusCode: overrides.statusCode ?? 101,
    status: overrides.status ?? 'Success',
    messageId: overrides.messageId ?? 'ATXid_abc',
    cost: overrides.cost ?? 'SDG 5.0000',
    number: '+249912345678',
  };
}

function makeAtResponse(recipient?: ReturnType<typeof makeAtRecipient>, message = 'Sent') {
  return {
    SMSMessageData: {
      Message: message,
      Recipients: recipient ? [recipient] : [],
    },
  };
}

async function buildService(config: Record<string, unknown>): Promise<{
  service: NotificationsService;
  prisma: {
    smsLog: { create: jest.Mock; update: jest.Mock };
    user: { updateMany: jest.Mock };
  };
}> {
  const prisma = {
    smsLog: {
      create: jest.fn(async (args: { data: unknown }) => ({
        id: 'log-1',
        ...(args.data as object),
      })),
      update: jest.fn(async () => ({})),
    },
    user: { updateMany: jest.fn(async () => ({ count: 0 })) },
  };
  const moduleRef = await Test.createTestingModule({
    providers: [
      NotificationsService,
      { provide: PrismaService, useValue: prisma },
      {
        provide: ConfigService,
        useValue: { get: jest.fn((key: string) => config[key]) },
      },
    ],
  }).compile();
  const service = moduleRef.get(NotificationsService);
  service.onModuleInit();
  return { service, prisma };
}

describe('NotificationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as any).fetch = jest.fn();
  });

  // ─── SMS stub mode ────────────────────────────────────────────────

  it('SMS stub mode → writes STUBBED row, no HTTP call', async () => {
    const { service, prisma } = await buildService(SMS_CONFIG_STUB);
    await service.sendSms('+249912345678', 'hello');
    expect(prisma.smsLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        phone: '+249912345678',
        message: 'hello',
        status: SMS_LOG_STATUS.STUBBED,
        provider: 'africas_talking',
      }),
    });
    expect((globalThis as any).fetch).not.toHaveBeenCalled();
  });

  // ─── SMS live happy paths ─────────────────────────────────────────

  it('SMS live success → PENDING then SENT with provider_ref; uses sandbox URL for sandbox account', async () => {
    const { service, prisma } = await buildService(SMS_CONFIG_LIVE);
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => makeAtResponse(makeAtRecipient()),
    });

    await service.sendSms('+249912345678', 'OTP 123456');

    expect(prisma.smsLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ status: SMS_LOG_STATUS.PENDING }),
    });
    expect((globalThis as any).fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (globalThis as any).fetch.mock.calls[0];
    expect(url).toBe('https://api.sandbox.africastalking.com/version1/messaging');
    expect(init.headers).toMatchObject({
      apiKey: 'live-key',
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    expect(prisma.smsLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: {
        status: SMS_LOG_STATUS.SENT,
        provider_ref: 'ATXid_abc',
      },
    });
  });

  it('SMS live → uses production URL when username != sandbox', async () => {
    const { service } = await buildService(SMS_CONFIG_LIVE_PROD);
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => makeAtResponse(makeAtRecipient()),
    });
    await service.sendSms('+249912345678', 'OTP 123456');
    const [url] = (globalThis as any).fetch.mock.calls[0];
    expect(url).toBe('https://api.africastalking.com/version1/messaging');
  });

  // ─── SMS live failure paths ───────────────────────────────────────

  it('SMS AT statusCode 403 → FAILED with statusCode in error_message', async () => {
    const { service, prisma } = await buildService(SMS_CONFIG_LIVE);
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () =>
        makeAtResponse(makeAtRecipient({ statusCode: 403, status: 'InvalidPhoneNumber' })),
    });
    await service.sendSms('+249912345678', 'x');
    expect(prisma.smsLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: {
        status: SMS_LOG_STATUS.FAILED,
        error_message: '403: InvalidPhoneNumber',
      },
    });
  });

  it('SMS HTTP 401 → FAILED with HTTP-status error_message', async () => {
    const { service, prisma } = await buildService(SMS_CONFIG_LIVE);
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });
    await service.sendSms('+249912345678', 'x');
    expect(prisma.smsLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: {
        status: SMS_LOG_STATUS.FAILED,
        error_message: expect.stringContaining('HTTP 401:'),
      },
    });
  });

  it('SMS HTTP 5xx → FAILED', async () => {
    const { service, prisma } = await buildService(SMS_CONFIG_LIVE);
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => 'gateway down',
    });
    await service.sendSms('+249912345678', 'x');
    expect(prisma.smsLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: expect.objectContaining({
        status: SMS_LOG_STATUS.FAILED,
        error_message: expect.stringContaining('HTTP 503'),
      }),
    });
  });

  it('SMS AbortError → FAILED with TIMEOUT_10S', async () => {
    const { service, prisma } = await buildService(SMS_CONFIG_LIVE);
    (globalThis as any).fetch.mockImplementationOnce(() => {
      const err = new Error('aborted');
      err.name = 'AbortError';
      throw err;
    });
    await service.sendSms('+249912345678', 'x');
    expect(prisma.smsLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: {
        status: SMS_LOG_STATUS.FAILED,
        error_message: 'TIMEOUT_10S',
      },
    });
  });

  it('SMS Arabic body → URL-encoded form payload', async () => {
    const { service } = await buildService(SMS_CONFIG_LIVE);
    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => makeAtResponse(makeAtRecipient()),
    });
    await service.sendSms('+249912345678', 'رمز التحقق: 123456');
    const [, init] = (globalThis as any).fetch.mock.calls[0];
    expect(init.body).toContain('message=');
    expect(init.body).toContain('to=%2B249912345678');
    // Verify Arabic was percent-encoded (no raw Unicode in form body)
    expect(init.body).toMatch(/%D8|%D9/);
  });

  // ─── FCM ──────────────────────────────────────────────────────────

  it('FCM stub mode (no service account) → no-op, no admin.messaging call', async () => {
    const { service } = await buildService(SMS_CONFIG_STUB);
    await service.sendPush('tok-xyz', 'title', 'body');
    expect(messagingMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('FCM happy path → admin.messaging().send resolves; service does not throw', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(
      JSON.stringify({ project_id: 'p', client_email: 'c', private_key: 'k' }) as any,
    );
    sendMock.mockResolvedValueOnce('projects/p/messages/abc');
    const { service } = await buildService({
      ...SMS_CONFIG_STUB,
      'fcm.serviceAccountPath': '/tmp/fake-fcm.json',
    });
    await service.sendPush('tok-xyz', 'title', 'body', { order_id: 'o1' });
    expect(sendMock).toHaveBeenCalledWith({
      token: 'tok-xyz',
      notification: { title: 'title', body: 'body' },
      data: { order_id: 'o1' },
    });
  });

  it('FCM registration-token-not-registered → swallowed; updateMany clears user.fcm_token', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(
      JSON.stringify({ project_id: 'p', client_email: 'c', private_key: 'k' }) as any,
    );
    const fakeErr = Object.assign(new Error('Token not registered'), {
      code: 'messaging/registration-token-not-registered',
    });
    sendMock.mockRejectedValueOnce(fakeErr);
    const { service, prisma } = await buildService({
      ...SMS_CONFIG_STUB,
      'fcm.serviceAccountPath': '/tmp/fake-fcm.json',
    });
    await service.sendPush('dead-token', 'title', 'body');
    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { fcm_token: 'dead-token' },
      data: { fcm_token: null },
    });
  });
});
