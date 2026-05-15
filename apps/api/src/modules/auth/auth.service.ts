import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  ForgotPasswordDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/auth.dto';

/**
 * Auth service — scaffolded per PRD §10.3 /api/auth and §15.1 security model.
 * Bodies pending implementation: register, OTP issue/verify, login (JWT 15m + refresh 30d
 * with rotation), refresh, logout, forgot/reset password.
 *
 * TODO: implement against {@link PrismaService} + {@link RedisService} + Africa's Talking SMS.
 */
@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(_dto: RegisterDto): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyOtp(_dto: VerifyOtpDto): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resendOtp(_dto: ResendOtpDto): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(_dto: LoginDto): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refresh(_dto: RefreshDto): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(_userId: string): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forgotPassword(_dto: ForgotPasswordDto): Promise<unknown> {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resetPassword(_dto: ResetPasswordDto): Promise<unknown> {
    throw new NotImplementedException();
  }
}
