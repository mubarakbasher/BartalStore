import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DeliveryZone, Gender, Language, SUDAN_PHONE_REGEX } from '@bartal/shared';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(2) @MaxLength(80) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional({ enum: Language }) @IsOptional() @IsEnum(Language) language?: Language;
  @ApiPropertyOptional() @IsOptional() @IsString() fcm_token?: string;
  @ApiPropertyOptional({ description: 'ISO 8601 date; null to clear' })
  @IsOptional()
  @IsISO8601()
  date_of_birth?: string | null;
  @ApiPropertyOptional({ enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
}

export class ChangePasswordDto {
  @ApiProperty() @IsString() currentPassword!: string;
  @ApiProperty() @IsString() @MinLength(8) @MaxLength(72) newPassword!: string;
}

export class CreateAddressDto {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(40) label!: string;
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(80) full_name!: string;
  @ApiProperty() @Matches(SUDAN_PHONE_REGEX) phone!: string;
  @ApiPropertyOptional() @IsOptional() @Matches(SUDAN_PHONE_REGEX) secondary_phone?: string;
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(80) district!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) street?: string;
  @ApiProperty({ description: 'Required — Sudan has no postal codes' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  landmark!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) delivery_notes?: string;
  @ApiProperty({ enum: DeliveryZone }) @IsEnum(DeliveryZone) zone!: DeliveryZone;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_default?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
