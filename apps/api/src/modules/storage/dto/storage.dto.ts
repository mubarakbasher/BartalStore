import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class UploadReceiptFormDto {
  @ApiProperty({ description: 'cuid of the order to attach the receipt to' })
  @IsString()
  @Matches(/^[a-z0-9]{20,}$/i, { message: 'INVALID_ORDER_ID' })
  order_id!: string;
}

export class SignedUrlBodyDto {
  @ApiProperty({ description: 'R2 key for a receipt (must start with `receipts/` or `stub/receipts/`)' })
  @IsString()
  @MaxLength(512)
  @Matches(/^(receipts\/|stub\/receipts\/)/, { message: 'STORAGE_KEY_INVALID' })
  key!: string;
}
