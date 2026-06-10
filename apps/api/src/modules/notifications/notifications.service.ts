import * as fs from 'node:fs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AT_SUCCESS_STATUS_CODES,
  AT_TIMEOUT_MS,
  SMS_LOG_STATUS,
  SMS_PROVIDER_AT,
} from './notifications.constants';

interface AtRecipient {
  statusCode?: number;
  status?: string;
  messageId?: string;
  cost?: string;
  number?: string;
}

interface AtResponse {
  SMSMessageData?: {
    Message?: string;
    Recipients?: AtRecipient[];
  };
}

/**
 * SMS + FCM dispatcher. Both `sendSms` and `sendPush` **never throw** —
 * channel failures are caught, logged, and persisted (SMS only). Callers
 * (`auth.service`, `orders.service`) wrap calls in try/catch defensively;
 * keeping this contract means a failure to log doesn't break the order
 * commit path or the OTP issue path.
 */
@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private smsStubMode = true;
  private fcmStubMode = true;
  private fcmApp: admin.app.App | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit(): void {
    const apiKey = this.config.get<string>('sms.apiKey') ?? '';
    this.smsStubMode = !apiKey;
    if (this.smsStubMode) {
      this.logger.warn('[SMS:STUB] Africa’s Talking disabled (no AT_API_KEY).');
    } else {
      this.logger.log('Africa’s Talking client configured.');
    }

    const fcmPath = this.config.get<string>('fcm.serviceAccountPath') ?? '';
    if (!fcmPath) {
      this.fcmStubMode = true;
      this.logger.warn('[FCM:STUB] Firebase disabled (no FCM_SERVICE_ACCOUNT_PATH).');
      return;
    }
    try {
      if (!fs.existsSync(fcmPath)) {
        throw new Error(`FCM service-account file missing at ${fcmPath}`);
      }
      const raw = fs.readFileSync(fcmPath, 'utf8');
      const serviceAccount = JSON.parse(raw) as admin.ServiceAccount;
      if (admin.apps.length === 0) {
        this.fcmApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        this.fcmApp = admin.app();
      }
      this.fcmStubMode = false;
      this.logger.log('Firebase Admin SDK initialized.');
    } catch (err) {
      this.fcmStubMode = true;
      this.logger.warn(
        `[FCM:STUB] init failed, push notifications disabled: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // SMS — Africa's Talking
  // ───────────────────────────────────────────────────────────────────

  /**
   * Send an SMS. Never throws — failures land in `sms_logs` with
   * `status='FAILED'` and `error_message`.
   */
  async sendSms(phone: string, message: string): Promise<void> {
    if (this.smsStubMode) {
      this.logger.warn(`[SMS:STUB] → ${phone}: ${message.slice(0, 80)}…`);
      try {
        await this.prisma.smsLog.create({
          data: {
            phone,
            message,
            status: SMS_LOG_STATUS.STUBBED,
            provider: SMS_PROVIDER_AT,
          },
        });
      } catch (err) {
        this.logger.error(
          `sms_logs STUBBED write failed: ${err instanceof Error ? err.message : err}`,
        );
      }
      return;
    }

    let logId: string;
    try {
      const created = await this.prisma.smsLog.create({
        data: {
          phone,
          message,
          status: SMS_LOG_STATUS.PENDING,
          provider: SMS_PROVIDER_AT,
        },
      });
      logId = created.id;
    } catch (err) {
      // If we can't even persist the PENDING row, log + bail. The caller's
      // try/catch still treats this as success-of-fire-and-forget.
      this.logger.error(
        `sms_logs PENDING write failed: ${err instanceof Error ? err.message : err}`,
      );
      return;
    }

    try {
      const username = this.config.get<string>('sms.username') ?? 'sandbox';
      const apiKey = this.config.get<string>('sms.apiKey') ?? '';
      const senderId = this.config.get<string>('sms.senderId') ?? '';
      const baseUrl =
        username === 'sandbox'
          ? 'https://api.sandbox.africastalking.com'
          : 'https://api.africastalking.com';

      const body = new URLSearchParams();
      body.set('username', username);
      body.set('to', phone);
      body.set('message', message);
      if (senderId) body.set('from', senderId);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AT_TIMEOUT_MS);

      let res: Response;
      try {
        res = await fetch(`${baseUrl}/version1/messaging`, {
          method: 'POST',
          headers: {
            apiKey,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        await this.markFailed(
          logId,
          `HTTP ${res.status}: ${truncate(text, 240)}`,
        );
        return;
      }

      const json = (await res.json().catch(() => ({}))) as AtResponse;
      const recipient = json.SMSMessageData?.Recipients?.[0];
      if (recipient && AT_SUCCESS_STATUS_CODES.has(recipient.statusCode ?? -1)) {
        await this.prisma.smsLog
          .update({
            where: { id: logId },
            data: {
              status: SMS_LOG_STATUS.SENT,
              provider_ref: recipient.messageId ?? null,
            },
          })
          .catch((err) =>
            this.logger.error(
              `sms_logs SENT update failed: ${err instanceof Error ? err.message : err}`,
            ),
          );
        if (recipient.cost) {
          this.logger.log(
            `SMS sent ${recipient.messageId ?? ''} cost=${recipient.cost} → ${phone}`,
          );
        }
        return;
      }

      const code = recipient?.statusCode ?? 'NO_RECIPIENT';
      const status =
        recipient?.status ?? json.SMSMessageData?.Message ?? 'unknown';
      await this.markFailed(logId, `${code}: ${status}`);
    } catch (err) {
      if (isAbortError(err)) {
        await this.markFailed(logId, 'TIMEOUT_10S');
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      await this.markFailed(logId, truncate(msg, 240));
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // FCM — Firebase Cloud Messaging
  // ───────────────────────────────────────────────────────────────────

  /**
   * Send a push notification. Never throws — channel failures are logged.
   * Revoked tokens are detected via `messaging/registration-token-not-registered`
   * and cleared from `User.fcm_token` (best-effort `updateMany`).
   */
  async sendPush(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (this.fcmStubMode) {
      this.logger.debug?.(
        `[FCM:STUB] → ${truncate(fcmToken, 12)}… "${title}": ${truncate(body, 80)}`,
      );
      return;
    }
    try {
      const messageId = await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: data ?? {},
      });
      this.logger.log(`FCM sent ${messageId} → ${truncate(fcmToken, 12)}…`);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (
        code === 'messaging/registration-token-not-registered' ||
        code === 'messaging/invalid-registration-token'
      ) {
        this.logger.warn(
          `FCM token revoked (${code}); clearing User.fcm_token where it matches.`,
        );
        try {
          await this.prisma.user.updateMany({
            where: { fcm_token: fcmToken },
            data: { fcm_token: null },
          });
        } catch (clearErr) {
          this.logger.error(
            `Failed to clear revoked fcm_token: ${
              clearErr instanceof Error ? clearErr.message : clearErr
            }`,
          );
        }
        return;
      }
      this.logger.error(
        `FCM send failed: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  private async markFailed(logId: string | null, errorMessage: string): Promise<void> {
    if (!logId) return;
    try {
      await this.prisma.smsLog.update({
        where: { id: logId },
        data: {
          status: SMS_LOG_STATUS.FAILED,
          error_message: errorMessage,
        },
      });
    } catch (err) {
      this.logger.error(
        `sms_logs FAILED update for ${logId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

function isAbortError(err: unknown): boolean {
  return Boolean(err && typeof err === 'object' && (err as { name?: string }).name === 'AbortError');
}
