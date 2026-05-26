import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
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
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) price!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) stock!: number;
  @ApiProperty() @IsString() category_id!: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_active?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() sku?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) compare_price?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() weight_grams?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name_en?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description_en?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) price?: number;
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
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) fee!: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  free_above?: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) estimated_days_min!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(0) estimated_days_max!: number;
}

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Free-form key/value pairs' })
  @IsObject()
  @IsNotEmpty()
  settings!: Record<string, string>;
}

export class UpdateProductImageDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_primary?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) sort_order?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() alt_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alt_en?: string;
}

export class UploadProductImageDto {
  @ApiPropertyOptional({ description: 'Promote this image to primary (unsets others).' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_primary?: boolean;

  @ApiPropertyOptional({ description: 'Sort order; lower renders first.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export const ADMIN_REVIEW_FILTERS = ['pending', 'flagged', 'approved', 'rejected', 'all'] as const;
export type AdminReviewFilter = (typeof ADMIN_REVIEW_FILTERS)[number];

export class ListAdminReviewsQueryDto {
  @ApiPropertyOptional({ enum: ADMIN_REVIEW_FILTERS })
  @IsOptional()
  @IsIn(ADMIN_REVIEW_FILTERS as unknown as string[])
  status?: AdminReviewFilter;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class RejectReviewDto {
  @ApiProperty({ description: 'Rejection reason; shown back to the customer.' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  reason!: string;
}

export const ADMIN_AUDIT_ENTITY_TYPES = [
  'Order',
  'Product',
  'Category',
  'DeliveryZoneFee',
  'AppSetting',
  'Review',
] as const;
export type AdminAuditEntityType = (typeof ADMIN_AUDIT_ENTITY_TYPES)[number];

export class ListAuditFeedQueryDto {
  @ApiPropertyOptional({ enum: ADMIN_AUDIT_ENTITY_TYPES })
  @IsOptional()
  @IsIn(ADMIN_AUDIT_ENTITY_TYPES as unknown as string[])
  entity_type?: AdminAuditEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actor_id?: string;

  @ApiPropertyOptional({ description: 'Max 100', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

// ───── Inventory log ─────
export const INVENTORY_MOVEMENT_TYPES = ['SALE', 'RETURN', 'RESTOCK', 'ADJUST'] as const;
export type InventoryMovementTypeFilter = (typeof INVENTORY_MOVEMENT_TYPES)[number];

export class InventoryMovementsQueryDto {
  @ApiPropertyOptional({ enum: INVENTORY_MOVEMENT_TYPES })
  @IsOptional()
  @IsIn(INVENTORY_MOVEMENT_TYPES as unknown as string[])
  type?: InventoryMovementTypeFilter;

  @ApiPropertyOptional() @IsOptional() @IsString() product_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() from?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() to?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}

// ───── Abandoned carts ─────
export const ABANDONED_CART_STAGES = ['cart', 'address', 'payment'] as const;
export type AbandonedCartStage = (typeof ABANDONED_CART_STAGES)[number];

export class AbandonedCartsQueryDto {
  @ApiPropertyOptional({ enum: ABANDONED_CART_STAGES })
  @IsOptional()
  @IsIn(ABANDONED_CART_STAGES as unknown as string[])
  stage?: AbandonedCartStage;

  @ApiPropertyOptional({ description: 'Min cart age in hours (default 1).' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_age_hours?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}

// ───── Sales analytics breakdown ─────
export const SALES_BREAKDOWNS = ['none', 'zone'] as const;
export type SalesBreakdown = (typeof SALES_BREAKDOWNS)[number];

// ───── Promos (Slice 3b-3) ─────
export const PROMO_TYPES = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'] as const;
export type PromoTypeValue = (typeof PROMO_TYPES)[number];

export const PROMO_FILTERS = ['active', 'scheduled', 'expired', 'inactive', 'all'] as const;
export type PromoFilter = (typeof PROMO_FILTERS)[number];

export class ListPromosQueryDto {
  @ApiPropertyOptional({ enum: PROMO_FILTERS })
  @IsOptional()
  @IsIn(PROMO_FILTERS as unknown as string[])
  status?: PromoFilter;

  @ApiPropertyOptional() @IsOptional() @IsString() q?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}

export class CreatePromoDto {
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(32) code!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) description_ar!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) description_en!: string;
  @ApiProperty({ enum: PROMO_TYPES }) @IsIn(PROMO_TYPES as unknown as string[]) type!: PromoTypeValue;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) value!: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) min_cart_amount?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) max_uses?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() starts_at?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expires_at?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_active?: boolean;
}

export class UpdatePromoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(1) description_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(1) description_en?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) value?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) min_cart_amount?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) max_uses?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() starts_at?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expires_at?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_active?: boolean;
}

// ───── Banners (Slice 3b-3) ─────
export const BANNER_STATUSES = ['LIVE', 'DRAFT'] as const;
export type BannerStatusValue = (typeof BANNER_STATUSES)[number];

export const BANNER_FILTERS = ['live', 'draft', 'all'] as const;
export type BannerFilter = (typeof BANNER_FILTERS)[number];

export class ListBannersQueryDto {
  @ApiPropertyOptional({ enum: BANNER_FILTERS })
  @IsOptional()
  @IsIn(BANNER_FILTERS as unknown as string[])
  status?: BannerFilter;
}

export class CreateBannerDto {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) title_ar!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) title_en!: string;
  @ApiProperty() @IsString() image_url!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cta_url?: string;
  @ApiPropertyOptional({ enum: BANNER_STATUSES })
  @IsOptional()
  @IsIn(BANNER_STATUSES as unknown as string[])
  status?: BannerStatusValue;
}

export class UpdateBannerDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title_ar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title_en?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() image_url?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cta_url?: string;
  @ApiPropertyOptional({ enum: BANNER_STATUSES })
  @IsOptional()
  @IsIn(BANNER_STATUSES as unknown as string[])
  status?: BannerStatusValue;
}

export const BANNER_MOVE_DIRECTIONS = ['up', 'down'] as const;
export type BannerMoveDirection = (typeof BANNER_MOVE_DIRECTIONS)[number];

export class MoveBannerDto {
  @ApiProperty({ enum: BANNER_MOVE_DIRECTIONS })
  @IsIn(BANNER_MOVE_DIRECTIONS as unknown as string[])
  direction!: BannerMoveDirection;
}

// ───── Refunds (Slice 3b-2) ─────
export const REFUND_FILTERS = ['pending', 'approved', 'rejected', 'all'] as const;
export type RefundFilter = (typeof REFUND_FILTERS)[number];

export class ListRefundsQueryDto {
  @ApiPropertyOptional({ enum: REFUND_FILTERS })
  @IsOptional()
  @IsIn(REFUND_FILTERS as unknown as string[])
  status?: RefundFilter;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}

export class CreateRefundDto {
  @ApiProperty() @IsString() @MinLength(1) order_id!: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0.01) amount!: number;
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(500) reason!: string;
}

export class RejectRefundDto {
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(255) reason!: string;
}

// ───── Shipping labels (Slice 3b-2) ─────
export const SHIPPING_LABEL_FILTERS = ['ready', 'printed', 'all'] as const;
export type ShippingLabelFilter = (typeof SHIPPING_LABEL_FILTERS)[number];

export class ListShippingLabelsQueryDto {
  @ApiPropertyOptional({ enum: SHIPPING_LABEL_FILTERS })
  @IsOptional()
  @IsIn(SHIPPING_LABEL_FILTERS as unknown as string[])
  status?: ShippingLabelFilter;
}

export class MarkLabelsPrintedDto {
  @ApiProperty({ description: 'Max 100 order ids in one call.' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsString({ each: true })
  order_ids!: string[];
}
