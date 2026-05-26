import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  type Address,
  type Order,
  type OrderItem,
  type OrderStatusHistory,
  type Product,
  type ProductImage,
  type User,
} from '@prisma/client';
import {
  OrderStatus,
  type Language,
  type PaymentMethod,
  type PaymentStatus,
} from '@bartal/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { nextOrderNumber } from '../../common/utils/order-number';
import { DeliveryService } from '../delivery/delivery.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { CancelOrderDto, CreateOrderDto, UploadReceiptDto } from './dto/orders.dto';
import {
  canTransition,
  cancellableStatuses,
  receiptUploadableStatuses,
} from './helpers/state-machine';
import { computeOrderTotals, lineTotal, priceToNumber } from './helpers/totals';
import { pickOrderSms, type OrderSmsEvent } from './helpers/sms-templates';

const CART_KEY = (userId: string): string => `bartal:cart:${userId}`;

type ProductWithPrimaryImage = Product & { images: ProductImage[] };

type OrderWithRelations = Order & {
  items: OrderItem[];
  status_history: OrderStatusHistory[];
  address: Address;
};

export interface OrderItemView {
  id: string;
  product_id: string;
  product_name_ar: string;
  product_name_en: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_info: Prisma.JsonValue | null;
}

export interface OrderStatusHistoryView {
  status: OrderStatus;
  note: string | null;
  changed_by_id: string | null;
  created_at: string;
}

export interface OrderAddressView {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  secondary_phone: string | null;
  district: string;
  street: string | null;
  landmark: string;
  delivery_notes: string | null;
  zone: Address['zone'];
}

export interface OrderView {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  notes: string | null;
  receipt_url: string | null;
  receipt_uploaded_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItemView[];
  status_history: OrderStatusHistoryView[];
  address: OrderAddressView;
}

export interface PaginatedOrders {
  items: OrderView[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly delivery: DeliveryService,
    private readonly redis: RedisService,
    private readonly notifications: NotificationsService,
  ) {}

  // ───────────────────────────────────────────────────────────────────
  // Public methods
  // ───────────────────────────────────────────────────────────────────

  async list(userId: string, page = 1, limit = 20): Promise<PaginatedOrders> {
    const safePage = Math.max(1, Math.floor(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Math.floor(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.order.count({ where: { user_id: userId } }),
      this.prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: safeLimit,
        include: {
          items: true,
          status_history: { orderBy: { created_at: 'asc' } },
          address: true,
        },
      }),
    ]);

    return {
      items: (rows as OrderWithRelations[]).map(toOrderView),
      page: safePage,
      limit: safeLimit,
      total,
      total_pages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  async detail(userId: string, orderId: string): Promise<OrderView> {
    const order = await this.findOwnedOrder(userId, orderId);
    return toOrderView(order);
  }

  async create(userId: string, dto: CreateOrderDto): Promise<OrderView> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw this.userNotFoundError();

    const address = await this.prisma.address.findFirst({
      where: { id: dto.address_id, user_id: userId },
    });
    if (!address) throw this.addressNotFoundError();

    const productIds = dto.items.map((it) => it.product_id);
    const products = (await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { where: { is_primary: true }, take: 1 } },
    })) as ProductWithPrimaryImage[];
    const byId = new Map(products.map((p) => [p.id, p]));

    // Resolve each requested line, validating product + stock.
    interface ResolvedLine {
      product: ProductWithPrimaryImage;
      quantity: number;
      variant_id?: string;
    }
    const resolved: ResolvedLine[] = [];
    for (const it of dto.items) {
      const product = byId.get(it.product_id);
      if (!product || !product.is_active) {
        throw new NotFoundException({
          code: 'PRODUCT_NOT_FOUND',
          message_en: 'One of the products in your order is unavailable.',
          message_ar: 'أحد المنتجات في طلبك غير متاح.',
          product_id: it.product_id,
        });
      }
      if (it.quantity > product.stock) {
        throw new ConflictException({
          code: 'OUT_OF_STOCK',
          message_en: `Only ${product.stock} left for "${product.name_en}".`,
          message_ar: `الكمية المتاحة من "${product.name_ar}" هي ${product.stock}.`,
          product_id: product.id,
          requested: it.quantity,
          available: product.stock,
        });
      }
      resolved.push({ product, quantity: it.quantity, variant_id: it.variant_id });
    }

    // Compute totals from current DB prices (never trust client values).
    const totals = computeOrderTotals(
      resolved.map((r) => ({
        product_id: r.product.id,
        unit_price: r.product.price,
        quantity: r.quantity,
      })),
      0,
    );
    const deliveryQuote = await this.delivery.calculateFee(
      address.zone,
      priceToNumber(totals.subtotal),
    );
    const finalTotals = computeOrderTotals(
      resolved.map((r) => ({
        product_id: r.product.id,
        unit_price: r.product.price,
        quantity: r.quantity,
      })),
      deliveryQuote.fee_sdg,
    );

    const initialStatus: OrderStatus =
      dto.payment_method === 'BANK_TRANSFER'
        ? OrderStatus.AWAITING_PAYMENT
        : OrderStatus.PENDING;

    const itemsCreate: Prisma.OrderItemCreateWithoutOrderInput[] = resolved.map((r) => ({
      product: { connect: { id: r.product.id } },
      product_name_ar: r.product.name_ar,
      product_name_en: r.product.name_en,
      product_image: r.product.images[0]?.url ?? null,
      quantity: r.quantity,
      unit_price: r.product.price,
      total_price: lineTotal(r.product.price, r.quantity),
      variant_info: r.variant_id ? { variant_id: r.variant_id } : Prisma.JsonNull,
    }));

    // Create the order + history + stock decrement inside an interactive tx.
    // One retry on P2002 covers the (rare) order_number collision window
    // between `nextOrderNumber` (count + 1) and the create write.
    // TODO(concurrency): replace count-based generator with an
    // `AppSetting.order_seq_YYYY` atomic increment once volume warrants it.
    let order: OrderWithRelations | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const orderNumber = await nextOrderNumber(this.prisma);
      try {
        order = await this.prisma.$transaction(async (tx) => {
          const created = await tx.order.create({
            data: {
              order_number: orderNumber,
              user: { connect: { id: userId } },
              address: { connect: { id: address.id } },
              status: initialStatus,
              payment_method: dto.payment_method,
              payment_status: 'UNPAID',
              subtotal: finalTotals.subtotal,
              delivery_fee: finalTotals.delivery_fee,
              discount: finalTotals.discount,
              total: finalTotals.total,
              notes: dto.notes ?? null,
              items: { create: itemsCreate },
            },
          });
          await tx.orderStatusHistory.create({
            data: {
              order_id: created.id,
              status: initialStatus,
              changed_by_id: userId,
              note:
                initialStatus === OrderStatus.AWAITING_PAYMENT
                  ? 'Order created; awaiting bank-transfer receipt'
                  : 'Order created (cash on delivery)',
            },
          });
          // TODO(concurrency): the read in step 4 and this write are not in
          // the same row-lock — concurrent orders could oversell. Acceptable
          // for low-volume MVP; switch to conditional updateMany with
          // `where: { stock: { gte: qty } }` when load grows.
          for (const r of resolved) {
            const updated = await tx.product.update({
              where: { id: r.product.id },
              data: { stock: { decrement: r.quantity } },
              select: { id: true, sku: true, stock: true },
            });
            try {
              await tx.inventoryMovement.create({
                data: {
                  product_id: r.product.id,
                  sku: updated.sku,
                  type: 'SALE',
                  quantity: -r.quantity,
                  stock_after: updated.stock,
                  reference: orderNumber,
                  actor_id: null,
                },
              });
            } catch (err) {
              this.logger.warn(
                `inventory_movement SALE insert failed for product ${r.product.id}: ${(err as Error).message}`,
              );
            }
          }
          return (await tx.order.findUnique({
            where: { id: created.id },
            include: {
              items: true,
              status_history: { orderBy: { created_at: 'asc' } },
              address: true,
            },
          })) as OrderWithRelations;
        });
        break;
      } catch (err) {
        if (isOrderNumberCollision(err) && attempt === 0) {
          this.logger.warn(
            `order_number ${orderNumber} collided on attempt ${attempt + 1}; retrying`,
          );
          continue;
        }
        throw err;
      }
    }
    if (!order) {
      throw new ConflictException({
        code: 'ORDER_NUMBER_COLLISION',
        message_en: 'Could not assign a unique order number. Please try again.',
        message_ar: 'تعذّر إنشاء رقم فريد للطلب. يرجى المحاولة مرة أخرى.',
      });
    }

    // Post-commit side-effects. Never throw — a paid-up order must survive
    // a transient Redis/SMS hiccup.
    await this.safeClearCart(userId);
    await this.fireOrderSms(
      user,
      order,
      dto.payment_method === 'BANK_TRANSFER' ? 'ORDER_CREATED_BANK' : 'ORDER_CREATED_COD',
    );

    return toOrderView(order);
  }

  async cancel(
    userId: string,
    orderId: string,
    dto: CancelOrderDto,
  ): Promise<OrderView> {
    const order = await this.findOwnedOrder(userId, orderId);
    if (!cancellableStatuses.has(order.status)) {
      throw this.invalidTransitionError(order.status, OrderStatus.CANCELLED);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          cancelled_at: new Date(),
          cancellation_reason: dto.reason ?? null,
        },
      });
      await tx.orderStatusHistory.create({
        data: {
          order_id: order.id,
          status: OrderStatus.CANCELLED,
          changed_by_id: userId,
          note: dto.reason ?? null,
        },
      });
      for (const item of order.items) {
        const updated = await tx.product.update({
          where: { id: item.product_id },
          data: { stock: { increment: item.quantity } },
          select: { id: true, sku: true, stock: true },
        });
        try {
          await tx.inventoryMovement.create({
            data: {
              product_id: item.product_id,
              sku: updated.sku,
              type: 'RETURN',
              quantity: item.quantity,
              stock_after: updated.stock,
              reference: order.order_number,
              actor_id: userId,
            },
          });
        } catch (err) {
          this.logger.warn(
            `inventory_movement RETURN (customer cancel) insert failed for product ${item.product_id}: ${(err as Error).message}`,
          );
        }
      }
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) await this.fireOrderSms(user, order, 'ORDER_CANCELLED');

    const refreshed = await this.findOwnedOrder(userId, orderId);
    return toOrderView(refreshed);
  }

  async uploadReceipt(
    userId: string,
    orderId: string,
    dto: UploadReceiptDto,
  ): Promise<OrderView> {
    const order = await this.findOwnedOrder(userId, orderId);
    if (order.payment_method !== 'BANK_TRANSFER') {
      throw new ConflictException({
        code: 'INVALID_PAYMENT_METHOD',
        message_en: 'Receipt upload is only valid for bank-transfer orders.',
        message_ar: 'رفع الإيصال متاح فقط لطلبات الحوالة البنكية.',
      });
    }
    if (!receiptUploadableStatuses.has(order.status)) {
      throw this.invalidTransitionError(order.status, OrderStatus.RECEIPT_UPLOADED);
    }

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.RECEIPT_UPLOADED,
          receipt_url: dto.receipt_url,
          receipt_uploaded_at: new Date(),
        },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          order_id: order.id,
          status: OrderStatus.RECEIPT_UPLOADED,
          changed_by_id: userId,
          note: 'Customer uploaded receipt',
        },
      }),
    ]);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) await this.fireOrderSms(user, order, 'RECEIPT_RECEIVED');

    const refreshed = await this.findOwnedOrder(userId, orderId);
    return toOrderView(refreshed);
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  private async findOwnedOrder(
    userId: string,
    orderId: string,
  ): Promise<OrderWithRelations> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: {
        items: true,
        status_history: { orderBy: { created_at: 'asc' } },
        address: true,
      },
    });
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message_en: 'Order not found.',
        message_ar: 'الطلب غير موجود.',
      });
    }
    return order as OrderWithRelations;
  }

  private userNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'USER_NOT_FOUND',
      message_en: 'User not found.',
      message_ar: 'المستخدم غير موجود.',
    });
  }

  private addressNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'ADDRESS_NOT_FOUND',
      message_en: 'Delivery address not found.',
      message_ar: 'عنوان التوصيل غير موجود.',
    });
  }

  private invalidTransitionError(
    from: OrderStatus,
    to: OrderStatus,
  ): ConflictException {
    return new ConflictException({
      code: 'INVALID_STATUS_TRANSITION',
      message_en: `Order cannot move from ${from} to ${to}.`,
      message_ar: 'لا يمكن إجراء هذا التغيير على حالة الطلب.',
      from,
      to,
    });
  }

  private async safeClearCart(userId: string): Promise<void> {
    try {
      await this.redis.del(CART_KEY(userId));
    } catch (err) {
      this.logger.warn(
        `Failed to clear cart for ${userId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  private async fireOrderSms(
    user: User,
    order: Pick<Order, 'order_number' | 'total'>,
    event: OrderSmsEvent,
    reason?: string,
  ): Promise<void> {
    try {
      const message = pickOrderSms(event, user.language as Language, {
        orderNumber: order.order_number,
        total: priceToNumber(order.total),
        reason,
      });
      await this.notifications.sendSms(user.phone, message);
    } catch (err) {
      this.logger.warn(
        `Failed to send ${event} SMS for ${order.order_number}: ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // Admin-only methods
  // ───────────────────────────────────────────────────────────────────

  /**
   * Admin-driven status transition. Validates via `canTransition` plus an
   * `adminBlockedTransitions` set covering pairs that must go through the
   * dedicated payment endpoint. Restores stock on admin cancellation.
   * Fires the matching customer SMS for SHIPPED / DELIVERED / CANCELLED.
   */
  async adminUpdateStatus(
    adminId: string,
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
  ): Promise<OrderView> {
    const order = await this.loadOrderForAdmin(orderId);
    const transitionKey = `${order.status}->${newStatus}` as const;
    if (ADMIN_BLOCKED_TRANSITIONS.has(transitionKey)) {
      throw new ConflictException({
        code: 'INVALID_ADMIN_TRANSITION',
        message_en: `Admins must use the dedicated payment endpoint for ${transitionKey}.`,
        message_ar: 'يجب استخدام نقطة الدفع المخصصة لهذا التغيير.',
        from: order.status,
        to: newStatus,
      });
    }
    if (!canTransition(order.status as OrderStatus, newStatus)) {
      throw this.invalidTransitionError(order.status as OrderStatus, newStatus);
    }

    const timestampField = TIMESTAMP_FIELD_BY_STATUS[newStatus];
    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          ...(timestampField ? { [timestampField]: new Date() } : {}),
          ...(newStatus === OrderStatus.CANCELLED
            ? { cancellation_reason: note ?? null }
            : {}),
        },
      });
      await tx.orderStatusHistory.create({
        data: {
          order_id: order.id,
          status: newStatus,
          changed_by_id: adminId,
          note: note ?? null,
        },
      });
      if (newStatus === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const updated = await tx.product.update({
            where: { id: item.product_id },
            data: { stock: { increment: item.quantity } },
            select: { id: true, sku: true, stock: true },
          });
          try {
            await tx.inventoryMovement.create({
              data: {
                product_id: item.product_id,
                sku: updated.sku,
                type: 'RETURN',
                quantity: item.quantity,
                stock_after: updated.stock,
                reference: order.order_number,
                actor_id: adminId,
              },
            });
          } catch (err) {
            this.logger.warn(
              `inventory_movement RETURN (admin cancel) insert failed for product ${item.product_id}: ${(err as Error).message}`,
            );
          }
        }
      }
    });

    const event = EVENT_FOR_ADMIN_STATUS[newStatus];
    if (event) {
      const customer = await this.prisma.user.findUnique({ where: { id: order.user_id } });
      if (customer) await this.fireOrderSms(customer, order, event);
    }

    const refreshed = await this.loadOrderForAdmin(orderId);
    return toOrderView(refreshed);
  }

  /** RECEIPT_UPLOADED → PAYMENT_CONFIRMED; sets paid_at; fires PAYMENT_CONFIRMED SMS. */
  async adminConfirmPayment(adminId: string, orderId: string): Promise<OrderView> {
    const order = await this.loadOrderForAdmin(orderId);
    if (order.status !== OrderStatus.RECEIPT_UPLOADED) {
      throw this.invalidTransitionError(
        order.status as OrderStatus,
        OrderStatus.PAYMENT_CONFIRMED,
      );
    }

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAYMENT_CONFIRMED,
          payment_status: 'PAID',
          paid_at: new Date(),
        },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          order_id: order.id,
          status: OrderStatus.PAYMENT_CONFIRMED,
          changed_by_id: adminId,
          note: 'Payment confirmed by admin',
        },
      }),
    ]);

    const customer = await this.prisma.user.findUnique({ where: { id: order.user_id } });
    if (customer) await this.fireOrderSms(customer, order, 'PAYMENT_CONFIRMED');

    const refreshed = await this.loadOrderForAdmin(orderId);
    return toOrderView(refreshed);
  }

  /**
   * RECEIPT_UPLOADED → PAYMENT_REJECTED. Reason required (≥3 chars trimmed).
   * `payment_status` stays UNPAID, `paid_at` stays null. SMS includes reason.
   */
  async adminRejectPayment(
    adminId: string,
    orderId: string,
    reason: string,
  ): Promise<OrderView> {
    const trimmed = (reason ?? '').trim();
    if (trimmed.length < 3) {
      throw new BadRequestException({
        code: 'REJECTION_REASON_REQUIRED',
        message_en: 'A rejection reason (3 or more characters) is required.',
        message_ar: 'يجب إدخال سبب الرفض (٣ أحرف على الأقل).',
      });
    }
    const order = await this.loadOrderForAdmin(orderId);
    if (order.status !== OrderStatus.RECEIPT_UPLOADED) {
      throw this.invalidTransitionError(
        order.status as OrderStatus,
        OrderStatus.PAYMENT_REJECTED,
      );
    }

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAYMENT_REJECTED },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          order_id: order.id,
          status: OrderStatus.PAYMENT_REJECTED,
          changed_by_id: adminId,
          note: trimmed,
        },
      }),
    ]);

    const customer = await this.prisma.user.findUnique({ where: { id: order.user_id } });
    if (customer) await this.fireOrderSms(customer, order, 'PAYMENT_REJECTED', trimmed);

    const refreshed = await this.loadOrderForAdmin(orderId);
    return toOrderView(refreshed);
  }

  /** Same `findFirst` shape as `findOwnedOrder` but without the user_id scope. */
  private async loadOrderForAdmin(orderId: string): Promise<OrderWithRelations> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        status_history: { orderBy: { created_at: 'asc' } },
        address: true,
      },
    });
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message_en: 'Order not found.',
        message_ar: 'الطلب غير موجود.',
      });
    }
    return order as OrderWithRelations;
  }
}

// Admins must not drive these pairs via the generic status endpoint —
// they go through `adminConfirmPayment` / `adminRejectPayment` instead.
const ADMIN_BLOCKED_TRANSITIONS: ReadonlySet<string> = new Set([
  `${OrderStatus.RECEIPT_UPLOADED}->${OrderStatus.PAYMENT_CONFIRMED}`,
  `${OrderStatus.RECEIPT_UPLOADED}->${OrderStatus.PAYMENT_REJECTED}`,
]);

const TIMESTAMP_FIELD_BY_STATUS: Partial<Record<OrderStatus, 'shipped_at' | 'delivered_at' | 'cancelled_at'>> = {
  [OrderStatus.SHIPPED]: 'shipped_at',
  [OrderStatus.DELIVERED]: 'delivered_at',
  [OrderStatus.CANCELLED]: 'cancelled_at',
};

const EVENT_FOR_ADMIN_STATUS: Partial<Record<OrderStatus, OrderSmsEvent>> = {
  [OrderStatus.SHIPPED]: 'ORDER_SHIPPED',
  [OrderStatus.DELIVERED]: 'ORDER_DELIVERED',
  [OrderStatus.CANCELLED]: 'ORDER_CANCELLED',
};

// ─────────────────────────────────────────────────────────────────────
// Response mapping
// ─────────────────────────────────────────────────────────────────────

function toOrderView(row: OrderWithRelations): OrderView {
  return {
    id: row.id,
    order_number: row.order_number,
    status: row.status as OrderStatus,
    payment_method: row.payment_method as PaymentMethod,
    payment_status: row.payment_status as PaymentStatus,
    subtotal: priceToNumber(row.subtotal),
    delivery_fee: priceToNumber(row.delivery_fee),
    discount: priceToNumber(row.discount),
    total: priceToNumber(row.total),
    notes: row.notes,
    receipt_url: row.receipt_url,
    receipt_uploaded_at: row.receipt_uploaded_at?.toISOString() ?? null,
    paid_at: row.paid_at?.toISOString() ?? null,
    shipped_at: row.shipped_at?.toISOString() ?? null,
    delivered_at: row.delivered_at?.toISOString() ?? null,
    cancelled_at: row.cancelled_at?.toISOString() ?? null,
    cancellation_reason: row.cancellation_reason,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    items: row.items.map((it) => ({
      id: it.id,
      product_id: it.product_id,
      product_name_ar: it.product_name_ar,
      product_name_en: it.product_name_en,
      product_image: it.product_image,
      quantity: it.quantity,
      unit_price: priceToNumber(it.unit_price),
      total_price: priceToNumber(it.total_price),
      variant_info: it.variant_info,
    })),
    status_history: row.status_history.map((h) => ({
      status: h.status as OrderStatus,
      note: h.note,
      changed_by_id: h.changed_by_id,
      created_at: h.created_at.toISOString(),
    })),
    address: {
      id: row.address.id,
      label: row.address.label,
      full_name: row.address.full_name,
      phone: row.address.phone,
      secondary_phone: row.address.secondary_phone,
      district: row.address.district,
      street: row.address.street,
      landmark: row.address.landmark,
      delivery_notes: row.address.delivery_notes,
      zone: row.address.zone,
    },
  };
}

function isOrderNumberCollision(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (err.code !== 'P2002') return false;
  const target = err.meta?.target;
  if (Array.isArray(target)) return target.includes('order_number');
  if (typeof target === 'string') return target.includes('order_number');
  return false;
}
