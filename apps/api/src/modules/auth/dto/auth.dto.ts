import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OtpPurpose, SUDAN_PHONE_REGEX } from '@bartal/shared';

const PHONE_REGEX = SUDAN_PHONE_REGEX;
const PHONE_EXAMPLE = '+249912345678';

export class RegisterDto {
  @ApiProperty({ example: PHONE_EXAMPLE })
  @Matches(PHONE_REGEX)
  phone!: string;

  @ApiProperty({ example: 'Fatima Ahmed' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: PHONE_EXAMPLE })
  @Matches(PHONE_REGEX)
  phone!: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{6}$/)
  code!: string;

  @ApiProperty({ enum: OtpPurpose })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}

export class ResendOtpDto {
  @ApiProperty({ example: PHONE_EXAMPLE })
  @Matches(PHONE_REGEX)
  phone!: string;

  @ApiProperty({ enum: OtpPurpose })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}

export class LoginDto {
  @ApiProperty({ example: PHONE_EXAMPLE })
  @Matches(PHONE_REGEX)
  phone!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  @MinLength(20)
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: PHONE_EXAMPLE })
  @Matches(PHONE_REGEX)
  phone!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: PHONE_EXAMPLE })
  @Matches(PHONE_REGEX)
  phone!: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{6}$/)
  code!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword!: string;
}
