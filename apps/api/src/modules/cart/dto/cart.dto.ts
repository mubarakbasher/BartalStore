import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty() @IsString() product_id!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() variant_id?: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) @Max(99) quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) @Max(99) quantity!: number;
}
