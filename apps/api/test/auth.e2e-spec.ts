import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_PHONE = '+249988887777';
const TEST_PASSWORD = 'E2ePassword123';
const TEST_NAME = 'E2E Test';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication({ bufferLogs: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
    await app.init();
    prisma = app.get(PrismaService);
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  async function cleanup() {
    const user = await prisma.user.findUnique({ where: { phone: TEST_PHONE } });
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }
  }

  async function fetchLatestOtp(): Promise<string> {
    const user = await prisma.user.findUniqueOrThrow({ where: { phone: TEST_PHONE } });
    const otp = await prisma.otpCode.findFirstOrThrow({
      where: { user_id: user.id, used: false },
      orderBy: { created_at: 'desc' },
    });
    return otp.code;
  }

  it('full flow: register → verify-otp → login → refresh → logout', async () => {
    // 1. Register
    const register = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ phone: TEST_PHONE, name: TEST_NAME, password: TEST_PASSWORD })
      .expect(201);
    expect(register.body).toMatchObject({
      success: true,
      data: { userId: expect.any(String), expiresAt: expect.any(String) },
    });

    // 2. Verify OTP (fetched directly from DB since SMS is stubbed)
    const code = await fetchLatestOtp();
    const verify = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ phone: TEST_PHONE, code, purpose: 'REGISTER' })
      .expect(200);
    expect(verify.body).toMatchObject({
      success: true,
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
        user: expect.objectContaining({ phone: TEST_PHONE, is_verified: true }),
      },
    });

    // 3. Login with phone + password
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: TEST_PHONE, password: TEST_PASSWORD })
      .expect(200);
    expect(login.body.success).toBe(true);
    expect(login.body.data.accessToken).toEqual(expect.any(String));
    const accessToken: string = login.body.data.accessToken;
    const refreshToken: string = login.body.data.refreshToken;

    // 4. Refresh — old refresh becomes invalid, new pair issued
    const refresh = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(200);
    expect(refresh.body.data.refreshToken).not.toEqual(refreshToken);
    expect(refresh.body.data.accessToken).toEqual(expect.any(String));

    // 4b. Reusing the rotated refresh token must fail
    const replay = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(401);
    expect(replay.body).toMatchObject({
      success: false,
      error: { code: 'INVALID_REFRESH_TOKEN', message_en: expect.any(String), message_ar: expect.any(String) },
    });

    // 5. Logout using the access token from login
    const logout = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    // Service returns `{ success: true }`; SuccessResponseInterceptor preserves
    // pre-shaped envelopes without re-wrapping under `data`.
    expect(logout.body).toEqual({ success: true });

    // 5b. The fresh refresh token from step 4 is now revoked too
    const postLogoutRefresh = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: refresh.body.data.refreshToken })
      .expect(401);
    expect(postLogoutRefresh.body.success).toBe(false);
  }, 30_000);

  it('manages fcm token via PUT /users/me/fcm-token', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: TEST_PHONE, password: TEST_PASSWORD })
      .expect(200);
    const auth = `Bearer ${login.body.data.accessToken}`;

    // Set a token
    const set = await request(app.getHttpServer())
      .put('/api/users/me/fcm-token')
      .set('Authorization', auth)
      .send({ fcm_token: 'fcm-token-e2e-xyz' })
      .expect(200);
    expect(set.body).toEqual({ success: true, data: { fcm_token: 'fcm-token-e2e-xyz' } });
    const userAfterSet = await prisma.user.findUniqueOrThrow({ where: { phone: TEST_PHONE } });
    expect(userAfterSet.fcm_token).toBe('fcm-token-e2e-xyz');

    // Clear it
    const clear = await request(app.getHttpServer())
      .put('/api/users/me/fcm-token')
      .set('Authorization', auth)
      .send({ fcm_token: null })
      .expect(200);
    expect(clear.body).toEqual({ success: true, data: { fcm_token: null } });
    const userAfterClear = await prisma.user.findUniqueOrThrow({ where: { phone: TEST_PHONE } });
    expect(userAfterClear.fcm_token).toBeNull();

    // The register/verify path also persisted at least one sms_logs row in
    // STUBBED status (AT_API_KEY is empty in the test env).
    const stubbed = await prisma.smsLog.count({
      where: { phone: TEST_PHONE, status: 'STUBBED' },
    });
    expect(stubbed).toBeGreaterThanOrEqual(1);
  }, 30_000);

  it('login with wrong password returns bilingual INVALID_CREDENTIALS', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: TEST_PHONE, password: 'totally-wrong' })
      .expect(401);
    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message_en: expect.any(String),
        message_ar: expect.any(String),
      },
    });
  });
});
