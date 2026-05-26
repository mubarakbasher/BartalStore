import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '@bartal/shared';

export class CreateOrderItemDto {
  @ApiProperty() @IsString() product_id!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() variant_id?: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) @Max(99) quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() address_id!: string;
  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) payment_method!: PaymentMethod;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) notes?: string;
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}

export class UploadReceiptDto {
  // TODO(schema): the column is named `receipt_url` but now stores an R2 key
  // (e.g. `receipts/2026/05/...webp`) produced by `POST /storage/receipts`.
  // Rename to `receipt_key` in a future migration; for now we accept R2 keys,
  // stub keys (test fixtures), and full URLs (back-compat) via the regex.
  @ApiProperty({
    description: 'R2 receipt key (or full URL for legacy callers)',
    example: 'receipts/2026/05/clxxx.../uuid.webp',
  })
  @IsString()
  @MaxLength(512)
  @Matches(/^(receipts\/|stub\/receipts\/|stub:\/\/|https?:\/\/)/, {
    message: 'INVALID_RECEIPT_URL',
  })
  receipt_url!: string;
}

export class CancelOrderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(3) @MaxLength(300) reason?: string;
}
