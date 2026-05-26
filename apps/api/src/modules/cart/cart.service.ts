import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { DeliveryZone } from '@bartal/shared';
import type { Address, Prisma, Product, ProductImage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { DeliveryService } from '../delivery/delivery.service';
import type { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

const CART_KEY = (userId: string): string => `bartal:cart:${userId}`;
const CART_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

interface CartStoredItem {
  product_id: string;
  quantity: number;
}

export interface CartLine {
  product_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  unit_price: number;
  image_url: string | null;
  quantity: number;
  stock: number;
  is_active: boolean;
  line_total: number;
}

export interface CartView {
  items: CartLine[];
  total_quantity: number;
  subtotal: number;
  delivery_preview: {
    zone: DeliveryZone;
    fee: number;
    free_delivery: boolean;
    threshold: number | null;
    eta_days: { min: number; max: number };
  } | null;
  total: number;
  requires_address: boolean;
}

type ProductWithImages = Product & { images: ProductImage[] };

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly delivery: DeliveryService,
  ) {}

  // ───────────────────────────────────────────────────────────────────
  // Public methods
  // ───────────────────────────────────────────────────────────────────

  async get(userId: string): Promise<CartView> {
    return this.computeView(userId, await this.readItems(userId));
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<CartView> {
    const product = await this.requireActiveProduct(dto.product_id);

    const items = await this.readItems(userId);
    const existing = items.find((it) => it.product_id === product.id);
    const requestedQty = (existing?.quantity ?? 0) + dto.quantity;

    if (requestedQty > product.stock) {
      throw this.outOfStockError(product.stock);
    }
    const cappedQty = Math.min(requestedQty, 99);

    const merged: CartStoredItem[] = existing
      ? items.map((it) =>
          it.product_id === product.id ? { ...it, quantity: cappedQty } : it,
        )
      : [...items, { product_id: product.id, quantity: cappedQty }];

    await this.writeItems(userId, merged);
    return this.computeView(userId, merged);
  }

  async updateItem(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartView> {
    const product = await this.requireActiveProduct(productId);

    const items = await this.readItems(userId);
    if (!items.some((it) => it.product_id === productId)) {
      throw new NotFoundException({
        code: 'ITEM_NOT_IN_CART',
        message_en: 'This item is not in your cart.',
        message_ar: 'هذا المنتج ليس في سلتك.',
      });
    }
    if (dto.quantity > product.stock) {
      throw this.outOfStockError(product.stock);
    }

    const next = items.map((it) =>
      it.product_id === productId ? { ...it, quantity: dto.quantity } : it,
    );
    await this.writeItems(userId, next);
    return this.computeView(userId, next);
  }

  async removeItem(userId: string, productId: string): Promise<CartView> {
    const items = await this.readItems(userId);
    const next = items.filter((it) => it.product_id !== productId);

    if (next.length === items.length) {
      // Idempotent: removing something not in the cart is a no-op.
      return this.computeView(userId, items);
    }
    if (next.length === 0) {
      await this.redis.del(CART_KEY(userId));
    } else {
      await this.writeItems(userId, next);
    }
    return this.computeView(userId, next);
  }

  async clear(userId: string): Promise<CartView> {
    await this.redis.del(CART_KEY(userId));
    this.mirrorDelete(userId);
    return this.computeView(userId, []);
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  private async readItems(userId: string): Promise<CartStoredItem[]> {
    const raw = await this.redis.get(CART_KEY(userId));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as CartStoredItem[];
      return Array.isArray(parsed) ? parsed.filter(isValidStoredItem) : [];
    } catch {
      this.logger.warn(`Corrupt cart payload for ${userId}; resetting`);
      await this.redis.del(CART_KEY(userId));
      return [];
    }
  }

  private async writeItems(userId: string, items: CartStoredItem[]): Promise<void> {
    await this.redis.setex(CART_KEY(userId), CART_TTL_SECONDS, JSON.stringify(items));
    this.mirrorUpsert(userId, items);
  }

  /** Fire-and-forget DB mirror so admin can query abandoned carts. */
  private mirrorUpsert(userId: string, items: CartStoredItem[]): void {
    try {
      this.prisma.cartSession
        .upsert({
          where: { user_id: userId },
          create: { user_id: userId, items: items as unknown as Prisma.InputJsonValue },
          update: { items: items as unknown as Prisma.InputJsonValue },
        })
        .catch((err: unknown) =>
          this.logger.warn(`cart_sessions mirror upsert failed: ${(err as Error).message}`),
        );
    } catch (err) {
      this.logger.warn(`cart_sessions mirror upsert threw: ${(err as Error).message}`);
    }
  }

  private mirrorDelete(userId: string): void {
    try {
      this.prisma.cartSession
        .deleteMany({ where: { user_id: userId } })
        .catch((err: unknown) =>
          this.logger.warn(`cart_sessions mirror delete failed: ${(err as Error).message}`),
        );
    } catch (err) {
      this.logger.warn(`cart_sessions mirror delete threw: ${(err as Error).message}`);
    }
  }

  private async computeView(userId: string, items: CartStoredItem[]): Promise<CartView> {
    if (items.length === 0) {
      return this.attachDeliveryPreview(userId, {
        items: [],
        total_quantity: 0,
        subtotal: 0,
        delivery_preview: null,
        total: 0,
        requires_address: false,
      });
    }

    const productIds = items.map((it) => it.product_id);
    const products = (await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { orderBy: [{ is_primary: 'desc' }, { sort_order: 'asc' }] } },
    })) as ProductWithImages[];
    const byId = new Map(products.map((p) => [p.id, p]));

    const lines: CartLine[] = [];
    const cleaned: CartStoredItem[] = [];
    let droppedAny = false;

    for (const stored of items) {
      const product = byId.get(stored.product_id);
      if (!product || !product.is_active) {
        droppedAny = true;
        continue;
      }
      const unit_price = priceToNumber(product.price);
      const quantity = Math.min(stored.quantity, product.stock);
      lines.push({
        product_id: product.id,
        slug: product.slug,
        name_ar: product.name_ar,
        name_en: product.name_en,
        unit_price,
        image_url: product.images[0]?.url ?? null,
        quantity,
        stock: product.stock,
        is_active: product.is_active,
        line_total: unit_price * quantity,
      });
      cleaned.push({ product_id: product.id, quantity });
    }

    // Self-heal: if products were filtered out or quantities clamped, persist the cleaned cart.
    const changed =
      droppedAny ||
      cleaned.length !== items.length ||
      cleaned.some((c, i) => c.quantity !== items[i].quantity);
    if (changed) {
      if (cleaned.length === 0) await this.redis.del(CART_KEY(userId));
      else await this.writeItems(userId, cleaned);
    }

    const subtotal = lines.reduce((acc, line) => acc + line.line_total, 0);
    const total_quantity = lines.reduce((acc, line) => acc + line.quantity, 0);

    return this.attachDeliveryPreview(userId, {
      items: lines,
      total_quantity,
      subtotal,
      delivery_preview: null,
      total: subtotal,
      requires_address: false,
    });
  }

  private async attachDeliveryPreview(userId: string, view: CartView): Promise<CartView> {
    const defaultAddress: Address | null = await this.prisma.address.findFirst({
      where: { user_id: userId, is_default: true },
    });
    if (!defaultAddress) {
      return { ...view, delivery_preview: null, requires_address: true };
    }
    const preview = await this.delivery.calculateFee(defaultAddress.zone, view.subtotal);
    return {
      ...view,
      delivery_preview: {
        zone: preview.zone,
        fee: preview.fee_sdg,
        free_delivery: preview.free_delivery,
        threshold: preview.threshold_sdg,
        eta_days: {
          min: preview.estimated_days_min,
          max: preview.estimated_days_max,
        },
      },
      total: view.subtotal + preview.fee_sdg,
      requires_address: false,
    };
  }

  private async requireActiveProduct(productId: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.is_active) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message_en: 'Product not found or unavailable.',
        message_ar: 'المنتج غير موجود أو غير متاح.',
      });
    }
    return product;
  }

  private outOfStockError(currentStock: number): ConflictException {
    return new ConflictException({
      code: 'OUT_OF_STOCK',
      message_en: `Only ${currentStock} left in stock.`,
      message_ar: `الكمية المتاحة فقط ${currentStock}.`,
      stock: currentStock,
    });
  }
}

function isValidStoredItem(value: unknown): value is CartStoredItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as CartStoredItem).product_id === 'string' &&
    Number.isInteger((value as CartStoredItem).quantity) &&
    (value as CartStoredItem).quantity > 0
  );
}

/** Prisma Decimal → JS number. SDG amounts are within safe-integer range for this market. */
function priceToNumber(price: Prisma.Decimal | number | string): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return Number(price);
  return price.toNumber();
}
