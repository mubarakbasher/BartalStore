import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { OrderStatus, PaymentStatus } from '@bartal/shared';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus }) @IsEnum(OrderStatus) status!: OrderStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class UpdateOrderPaymentDto {
  @ApiProperty({ enum: PaymentStatus }) @IsEnum(PaymentStatus) status!: PaymentStatus;
  @ApiPropertyOptional({ description: 'Required if rejecting payment' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateProductDto {
  @ApiProperty() @IsString() @MinLength(1) name_ar!: string;
  @ApiProperty() @IsString() @MinLength(1) name_en!: string;
  @ApiProperty() @IsString() description_ar!: string;
  @ApiProperty() @IsString() description_en!: string;
  @ApiProperty() @IsString() slug!: string;
  @ApiProperty() @Type(() => Number) price!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) stock!: number;
  @ApiProperty() @IsString() category_id!: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_active?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() sku?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) compare_price?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() weight_grams?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name_en?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description_en?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) price?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) stock?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() category_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_active?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_featured?: boolean;
}

export class CreateCategoryDto {
  @ApiProperty() @IsString() name_ar!: string;
  @ApiProperty() @IsString() name_en!: string;
  @ApiProperty() @IsString() slug!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parent_id?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() sort_order?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name_en?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parent_id?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() sort_order?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_active?: boolean;
}

export class UpdateZoneFeeDto {
  @ApiProperty() @Type(() => Number) fee!: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) free_above?: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) estimated_days_min!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) estimated_days_max!: number;
}

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Free-form key/value pairs' })
  settings!: Record<string, string>;
}
