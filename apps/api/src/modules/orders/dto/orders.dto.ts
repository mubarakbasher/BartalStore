import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
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
  @ApiProperty() @IsUrl() receipt_url!: string;
}

export class CancelOrderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(3) @MaxLength(300) reason?: string;
}
