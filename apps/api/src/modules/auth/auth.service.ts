import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerException } from '@nestjs/throttler';
import { OtpPurpose } from '@bartal/shared';
import type { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { comparePassword, hashPassword } from '../../common/utils/password';
import type {
  ForgotPasswordDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import type { JwtPayload } from './strategies/jwt.strategy';
import {
  generateOtpCode,
  generateRefreshToken,
  hashRefreshToken,
  parseTtlSeconds,
} from './helpers/tokens';
import { otpSmsMessage } from './helpers/messages';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PublicUser {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: User['role'];
  language: User['language'];
  is_verified: boolean;
  created_at: Date;
}

function publicUserShape(user: User): PublicUser {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
    role: user.role,
    language: user.language,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
  ) {}

  private get bcryptRounds(): number {
    return this.config.get<number>('jwt.bcryptRounds') ?? 12;
  }

  private get otpTtlSeconds(): number {
    return this.config.get<number>('otp.ttlSeconds') ?? 600;
  }

  private get otpMaxPerWindow(): number {
    return this.config.get<number>('otp.maxPerWindow') ?? 5;
  }

  private get otpWindowSeconds(): number {
    return this.config.get<number>('otp.windowSeconds') ?? 900;
  }

  private get accessTtlSeconds(): number {
    return parseTtlSeconds(this.config.get<string>('jwt.accessTtl'), 15 * 60);
  }

  private get refreshTtlSeconds(): number {
    return parseTtlSeconds(this.config.get<string>('jwt.refreshTtl'), 30 * 24 * 60 * 60);
  }

  // ───────────────────────────────────────────────────────────────────
  // Public endpoints
  // ───────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ userId: string; expiresAt: Date }> {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });

    if (existing && existing.is_verified) {
      throw new ConflictException({
        code: 'USER_EXISTS',
        message_en: 'An account with this phone number already exists. Please log in.',
        message_ar: 'يوجد حساب بهذا الرقم بالفعل. يُرجى تسجيل الدخول.',
      });
    }

    const user = existing
      ? existing
      : await this.prisma.user.create({
          data: {
            phone: dto.phone,
            name: dto.name,
            email: dto.email,
            password_hash: await hashPassword(dto.password, this.bcryptRounds),
          },
        });

    const { expiresAt } = await this.issueAndSendOtp(user, OtpPurpose.REGISTER);
    return { userId: user.id, expiresAt };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ user: PublicUser } & TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) throw this.invalidOtpError();

    const otp = await this.prisma.otpCode.findFirst({
      where: {
        user_id: user.id,
        code: dto.code,
        purpose: dto.purpose,
        used: false,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });
    if (!otp) throw this.invalidOtpError();

    await this.prisma.$transaction([
      this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } }),
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          is_verified: dto.purpose === OtpPurpose.REGISTER ? true : user.is_verified,
          last_login_at: new Date(),
        },
      }),
    ]);

    const fresh = { ...user, is_verified: true, last_login_at: new Date() };
    const tokens = await this.issueTokens(fresh);
    return { user: publicUserShape(fresh), ...tokens };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ expiresAt: Date }> {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      // Don't leak existence — return a plausible future date.
      return { expiresAt: new Date(Date.now() + this.otpTtlSeconds * 1000) };
    }

    const since = new Date(Date.now() - this.otpWindowSeconds * 1000);
    const recentCount = await this.prisma.otpCode.count({
      where: { user_id: user.id, created_at: { gt: since } },
    });
    if (recentCount >= this.otpMaxPerWindow) {
      throw new ThrottlerException(JSON.stringify({
        code: 'TOO_MANY_OTPS',
        message_en: 'Too many OTP requests. Try again in a few minutes.',
        message_ar: 'طلبات كثيرة لرمز التحقق. حاول مجدداً بعد بضع دقائق.',
      }));
    }

    const { expiresAt } = await this.issueAndSendOtp(user, dto.purpose);
    return { expiresAt };
  }

  async login(dto: LoginDto): Promise<{ user: PublicUser } & TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user || !user.is_active) throw this.invalidCredentialsError();

    const ok = await comparePassword(dto.password, user.password_hash);
    if (!ok) throw this.invalidCredentialsError();

    if (!user.is_verified) {
      throw new UnauthorizedException({
        code: 'PHONE_NOT_VERIFIED',
        message_en: 'Verify your phone number before logging in.',
        message_ar: 'يرجى التحقق من رقم هاتفك قبل تسجيل الدخول.',
      });
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    const tokens = await this.issueTokens(updated);
    return { user: publicUserShape(updated), ...tokens };
  }

  async refresh(dto: RefreshDto): Promise<TokenPair> {
    const tokenHash = hashRefreshToken(dto.refreshToken);
    const row = await this.prisma.refreshToken.findUnique({ where: { token_hash: tokenHash } });

    if (!row || row.revoked || row.expires_at <= new Date()) {
      throw this.invalidRefreshTokenError();
    }

    const user = await this.prisma.user.findUnique({ where: { id: row.user_id } });
    if (!user || !user.is_active) throw this.invalidRefreshTokenError();

    // Rotate: atomically mark this row revoked, refusing if a concurrent refresh beat us.
    const rotated = await this.prisma.refreshToken.updateMany({
      where: { id: row.id, revoked: false },
      data: { revoked: true },
    });
    if (rotated.count !== 1) throw this.invalidRefreshTokenError();

    return this.issueTokens(user);
  }

  async logout(userId: string): Promise<{ success: true }> {
    await this.prisma.refreshToken.updateMany({
      where: { user_id: userId, revoked: false },
      data: { revoked: true },
    });
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ expiresAt: Date }> {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      return { expiresAt: new Date(Date.now() + this.otpTtlSeconds * 1000) };
    }
    const { expiresAt } = await this.issueAndSendOtp(user, OtpPurpose.PASSWORD_RESET);
    return { expiresAt };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) throw this.invalidOtpError();

    const otp = await this.prisma.otpCode.findFirst({
      where: {
        user_id: user.id,
        code: dto.code,
        purpose: OtpPurpose.PASSWORD_RESET,
        used: false,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });
    if (!otp) throw this.invalidOtpError();

    const newHash = await hashPassword(dto.newPassword, this.bcryptRounds);

    await this.prisma.$transaction([
      this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { password_hash: newHash },
      }),
      this.prisma.refreshToken.updateMany({
        where: { user_id: user.id, revoked: false },
        data: { revoked: true },
      }),
    ]);

    return { success: true };
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  private async issueAndSendOtp(
    user: User,
    purpose: OtpPurpose,
  ): Promise<{ code: string; expiresAt: Date }> {
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + this.otpTtlSeconds * 1000);

    await this.prisma.otpCode.create({
      data: { user_id: user.id, code, purpose, expires_at: expiresAt },
    });

    const message = otpSmsMessage(purpose, user.language, code);
    try {
      await this.notifications.sendSms(user.phone, message);
    } catch (err) {
      this.logger.error(`SMS send failed for ${user.phone}: ${(err as Error).message}`);
      // Don't block the flow — OTP is in DB; client can use /resend-otp if SMS truly fails.
    }

    return { code, expiresAt };
  }

  private async issueTokens(user: User): Promise<TokenPair> {
    const payload: JwtPayload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessTtl') ?? '15m',
    });

    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTtlSeconds * 1000);

    await this.prisma.refreshToken.create({
      data: { user_id: user.id, token_hash: tokenHash, expires_at: expiresAt },
    });

    return { accessToken, refreshToken, expiresIn: this.accessTtlSeconds };
  }

  private invalidCredentialsError(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_CREDENTIALS',
      message_en: 'Incorrect phone or password.',
      message_ar: 'رقم الهاتف أو كلمة المرور غير صحيحة.',
    });
  }

  private invalidOtpError(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_OTP',
      message_en: 'The verification code is invalid or expired.',
      message_ar: 'رمز التحقق غير صالح أو منتهي الصلاحية.',
    });
  }

  private invalidRefreshTokenError(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_REFRESH_TOKEN',
      message_en: 'Session expired. Please log in again.',
      message_ar: 'انتهت الجلسة. يُرجى تسجيل الدخول مجدداً.',
    });
  }
}
