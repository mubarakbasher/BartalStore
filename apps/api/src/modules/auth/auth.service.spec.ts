import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { OtpPurpose } from '@bartal/shared';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { hashRefreshToken } from './helpers/tokens';

jest.mock('../../common/utils/password', () => ({
  hashPassword: jest.fn(async (pwd: string) => `hashed:${pwd}`),
  comparePassword: jest.fn(async (pwd: string, hash: string) => hash === `hashed:${pwd}`),
}));

const CONFIG_VALUES: Record<string, unknown> = {
  'jwt.accessSecret': 'test-secret',
  'jwt.accessTtl': '15m',
  'jwt.refreshTtl': '30d',
  'jwt.bcryptRounds': 4,
  'otp.ttlSeconds': 600,
  'otp.maxPerWindow': 5,
  'otp.windowSeconds': 900,
};

function makeUser(overrides: Partial<{ id: string; phone: string; is_verified: boolean; is_active: boolean; language: 'AR' | 'EN' }> = {}) {
  return {
    id: overrides.id ?? 'u1',
    phone: overrides.phone ?? '+249912345678',
    name: 'Test User',
    email: null,
    password_hash: 'hashed:Password123',
    is_verified: overrides.is_verified ?? true,
    is_active: overrides.is_active ?? true,
    role: 'CUSTOMER' as const,
    language: overrides.language ?? ('AR' as const),
    fcm_token: null,
    last_login_at: null,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
    otpCode: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; count: jest.Mock };
    refreshToken: {
      findUnique: jest.Mock;
      create: jest.Mock;
      updateMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let notifications: { sendSms: jest.Mock };
  let jwt: { signAsync: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      otpCode: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
      refreshToken: { findUnique: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
      $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
    };
    notifications = { sendSms: jest.fn().mockResolvedValue(undefined) };
    jwt = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsService, useValue: notifications },
        { provide: JwtService, useValue: jwt },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => CONFIG_VALUES[key]) },
        },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  describe('register', () => {
    it('creates a new user, persists OTP, and sends SMS', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(makeUser({ is_verified: false }));
      prisma.otpCode.create.mockResolvedValue({});

      const result = await service.register({
        phone: '+249912345678',
        name: 'Test User',
        password: 'Password123',
      });

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ phone: '+249912345678' }) }),
      );
      expect(prisma.otpCode.create).toHaveBeenCalled();
      expect(notifications.sendSms).toHaveBeenCalledWith('+249912345678', expect.stringMatching(/\d{6}/));
      expect(result).toEqual({ userId: 'u1', expiresAt: expect.any(Date) });
    });

    it('rejects when an already-verified user exists', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_verified: true }));
      await expect(
        service.register({ phone: '+249912345678', name: 'X', password: 'Password123' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('reuses the row and resends OTP when the user exists but is unverified', async () => {
      const existing = makeUser({ is_verified: false });
      prisma.user.findUnique.mockResolvedValue(existing);
      prisma.otpCode.create.mockResolvedValue({});

      const result = await service.register({
        phone: existing.phone,
        name: 'X',
        password: 'Password123',
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.otpCode.create).toHaveBeenCalled();
      expect(result.userId).toBe(existing.id);
    });
  });

  describe('verifyOtp', () => {
    it('marks OTP used, flips is_verified for REGISTER, and issues tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_verified: false }));
      prisma.otpCode.findFirst.mockResolvedValue({ id: 'otp1' });
      prisma.user.update.mockResolvedValue(makeUser({ is_verified: true }));
      prisma.otpCode.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.verifyOtp({
        phone: '+249912345678',
        code: '123456',
        purpose: OtpPurpose.REGISTER,
      });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.refreshToken).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(result.user).toMatchObject({ id: 'u1', is_verified: true });
    });

    it('throws INVALID_OTP when code does not match', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.otpCode.findFirst.mockResolvedValue(null);
      await expect(
        service.verifyOtp({ phone: '+249912345678', code: '000000', purpose: OtpPurpose.REGISTER }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws INVALID_OTP for unknown user (no enumeration leak)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.verifyOtp({ phone: '+249900000000', code: '123456', purpose: OtpPurpose.REGISTER }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('resendOtp', () => {
    it('returns a generic expiresAt for unknown users without sending SMS', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.resendOtp({ phone: '+249900000000', purpose: OtpPurpose.REGISTER });
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(notifications.sendSms).not.toHaveBeenCalled();
    });

    it('throws ThrottlerException when the per-user OTP cap is hit', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.otpCode.count.mockResolvedValue(5);
      await expect(
        service.resendOtp({ phone: '+249912345678', purpose: OtpPurpose.LOGIN }),
      ).rejects.toBeInstanceOf(ThrottlerException);
    });

    it('issues + sends a fresh OTP for a known user under the cap', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.otpCode.count.mockResolvedValue(0);
      prisma.otpCode.create.mockResolvedValue({});
      await service.resendOtp({ phone: '+249912345678', purpose: OtpPurpose.LOGIN });
      expect(prisma.otpCode.create).toHaveBeenCalled();
      expect(notifications.sendSms).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns tokens for a verified user with correct password', async () => {
      const user = makeUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ phone: user.phone, password: 'Password123' });
      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.user.id).toBe('u1');
    });

    it('rejects unknown phone with INVALID_CREDENTIALS', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ phone: '+249900000000', password: 'whatever' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects wrong password with INVALID_CREDENTIALS', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      await expect(
        service.login({ phone: '+249912345678', password: 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects unverified users with PHONE_NOT_VERIFIED', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_verified: false }));
      const err = await service
        .login({ phone: '+249912345678', password: 'Password123' })
        .catch((e: UnauthorizedException) => e);
      expect(err).toBeInstanceOf(UnauthorizedException);
      expect((err as UnauthorizedException).getResponse()).toMatchObject({
        code: 'PHONE_NOT_VERIFIED',
      });
    });

    it('rejects inactive users with INVALID_CREDENTIALS', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_active: false }));
      await expect(
        service.login({ phone: '+249912345678', password: 'Password123' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    const rawToken = 'opaque-refresh-token-with-plenty-of-entropy';
    const tokenHash = hashRefreshToken(rawToken);

    it('rotates the refresh token and issues a new pair', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        user_id: 'u1',
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 60_000),
        revoked: false,
      });
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.refresh({ refreshToken: rawToken });
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'rt1', revoked: false } }),
      );
      expect(result.refreshToken).not.toBe(rawToken);
      expect(result.accessToken).toBe('signed.jwt.token');
    });

    it('rejects a missing refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.refresh({ refreshToken: rawToken })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects an expired refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1', user_id: 'u1', token_hash: tokenHash,
        expires_at: new Date(Date.now() - 1000), revoked: false,
      });
      await expect(service.refresh({ refreshToken: rawToken })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a revoked refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1', user_id: 'u1', token_hash: tokenHash,
        expires_at: new Date(Date.now() + 60_000), revoked: true,
      });
      await expect(service.refresh({ refreshToken: rawToken })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('throws if a concurrent refresh already rotated the token (CAS check)', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1', user_id: 'u1', token_hash: tokenHash,
        expires_at: new Date(Date.now() + 60_000), revoked: false,
      });
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });
      await expect(service.refresh({ refreshToken: rawToken })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('revokes every active refresh token for the user', async () => {
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });
      const result = await service.logout('u1');
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'u1', revoked: false },
        data: { revoked: true },
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('forgotPassword + resetPassword', () => {
    it('forgotPassword sends a reset OTP for an existing user', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.otpCode.create.mockResolvedValue({});
      const result = await service.forgotPassword({ phone: '+249912345678' });
      expect(prisma.otpCode.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ purpose: OtpPurpose.PASSWORD_RESET }) }),
      );
      expect(notifications.sendSms).toHaveBeenCalled();
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('forgotPassword returns a generic response for unknown users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword({ phone: '+249900000000' });
      expect(notifications.sendSms).not.toHaveBeenCalled();
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('resetPassword updates the hash and revokes all refresh tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.otpCode.findFirst.mockResolvedValue({ id: 'otp1' });
      prisma.otpCode.update.mockResolvedValue({});
      prisma.user.update.mockResolvedValue(makeUser());
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.resetPassword({
        phone: '+249912345678',
        code: '123456',
        newPassword: 'NewPassword123',
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('resetPassword throws INVALID_OTP for an unknown user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.resetPassword({
          phone: '+249900000000',
          code: '123456',
          newPassword: 'NewPassword123',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
