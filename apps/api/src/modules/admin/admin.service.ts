import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  type Category,
  type DeliveryZoneFee,
  type Product,
  type ProductImage,
} from '@prisma/client';
import {
  DeliveryZone,
  OrderStatus,
  PaymentStatus,
  RefundStatus,
} from '@bartal/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { pickOrderSms } from '../orders/helpers/sms-templates';
import type { OrderSmsEvent, OrderSmsContext } from '../orders/helpers/sms-templates';
import {
  refundEligibleStatuses,
  canTransition,
} from '../orders/helpers/state-machine';
import { nextRefundNumber } from './helpers/refund-number';
import { derivePromoStatus } from './helpers/promo-status';
import {
  AbandonedCartsQueryDto,
  CreateBannerDto,
  CreateCategoryDto,
  CreateProductDto,
  CreatePromoDto,
  CreateRefundDto,
  InventoryMovementsQueryDto,
  ListAdminReviewsQueryDto,
  ListAuditFeedQueryDto,
  ListBannersQueryDto,
  ListPromosQueryDto,
  ListRefundsQueryDto,
  ListShippingLabelsQueryDto,
  MarkLabelsPrintedDto,
  MoveBannerDto,
  RejectRefundDto,
  RejectReviewDto,
  UpdateBannerDto,
  UpdateCategoryDto,
  UpdateOrderPaymentDto,
  UpdateOrderStatusDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdatePromoDto,
  UpdateSettingsDto,
  UpdateZoneFeeDto,
  UploadProductImageDto,
} from './dto/admin.dto';
import {
  AUDIT_ACTION,
  AUDIT_ENTITY_TYPE,
  type AuditAction,
  type AuditEntityType,
} from './helpers/audit';

const MAX_DATE_RANGE_DAYS = 365;
const MAX_SETTINGS_KEYS_PER_CALL = 50;
const MAX_SETTINGS_VALUE_BYTES = 4000;
const SETTING_KEY_REGEX = /^[a-z][a-z0-9_.-]{0,63}$/;
const CATEGORY_MAX_DEPTH = 5;

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationsService,
  ) {}

  // ───────────────────────────────────────────────────────────────────
  // Dashboard + analytics
  // ───────────────────────────────────────────────────────────────────

  async dashboard() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [revenueAgg, ordersToday, statusGroups, lowStock, pendingPayments, topGroups, recentOrders] =
      await Promise.all([
        this.prisma.order.aggregate({
          _sum: { total: true },
          where: {
            created_at: { gte: startOfToday },
            status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] },
          },
        }),
        this.prisma.order.count({ where: { created_at: { gte: startOfToday } } }),
        this.prisma.order.groupBy({
          by: ['status'],
          _count: { status: true },
          orderBy: { status: 'asc' },
        }),
        this.prisma.product.count({
          where: { is_active: true, stock: { lte: 5 } },
        }),
        this.prisma.order.count({ where: { status: OrderStatus.RECEIPT_UPLOADED } }),
        this.prisma.orderItem.groupBy({
          by: ['product_id'],
          where: {
            order: {
              created_at: { gte: thirtyDaysAgo },
              status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] },
            },
          },
          _sum: { quantity: true, total_price: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
        this.prisma.order.findMany({
          orderBy: { created_at: 'desc' },
          take: 6,
          include: { user: { select: { name: true } } },
        }),
      ]);

    const orders_by_status = (
      statusGroups as Array<{ status: string; _count: { status: number } }>
    ).map((group) => ({ status: group.status, count: group._count.status }));

    const topIds = topGroups.map((g) => g.product_id);
    const products =
      topIds.length === 0
        ? []
        : await this.prisma.product.findMany({
            where: { id: { in: topIds } },
            include: { images: { where: { is_primary: true }, take: 1 } },
          });
    const productById = new Map(products.map((p) => [p.id, p]));
    const top_products = topGroups.map((g) => {
      const p = productById.get(g.product_id);
      return {
        product_id: g.product_id,
        name_ar: p?.name_ar ?? null,
        name_en: p?.name_en ?? null,
        slug: p?.slug ?? null,
        image_url: (p as Product & { images?: ProductImage[] })?.images?.[0]?.url ?? null,
        units_sold: g._sum.quantity ?? 0,
        revenue: g._sum.total_price ? Number(g._sum.total_price) : 0,
      };
    });

    const daily_revenue = await this.dailyRevenueRange(thirtyDaysAgo, new Date());

    return {
      revenue_today: revenueAgg._sum.total ? Number(revenueAgg._sum.total) : 0,
      orders_today: ordersToday,
      orders_by_status,
      low_stock_count: lowStock,
      pending_payments: pendingPayments,
      top_products,
      daily_revenue,
      recent_orders: recentOrders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        total: Number(o.total),
        status: o.status,
        payment_method: o.payment_method,
        created_at: o.created_at,
        customer_name: o.user.name,
      })),
    };
  }

  async salesAnalytics(from?: string, to?: string, breakdown: 'none' | 'zone' = 'none') {
    const end = to ? new Date(to) : new Date();
    const start = from ? new Date(from) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException({
        code: 'INVALID_DATE',
        message_en: 'from/to must be valid ISO dates.',
        message_ar: 'تواريخ النطاق غير صالحة.',
      });
    }
    if (start > end) {
      throw new BadRequestException({
        code: 'INVALID_DATE_RANGE',
        message_en: 'from must be on or before to.',
        message_ar: 'تاريخ البداية يجب أن يسبق تاريخ النهاية.',
      });
    }
    const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    if (days > MAX_DATE_RANGE_DAYS) {
      throw new BadRequestException({
        code: 'DATE_RANGE_TOO_LARGE',
        message_en: `Date range cannot exceed ${MAX_DATE_RANGE_DAYS} days.`,
        message_ar: `نطاق التواريخ لا يمكن أن يتجاوز ${MAX_DATE_RANGE_DAYS} يوماً.`,
      });
    }
    if (breakdown === 'zone') {
      return {
        from: start.toISOString(),
        to: end.toISOString(),
        breakdown,
        days: await this.dailyRevenueByZone(start, end),
      };
    }
    return {
      from: start.toISOString(),
      to: end.toISOString(),
      breakdown: 'none' as const,
      days: await this.dailyRevenueRange(start, end),
    };
  }

  async topProducts(limit?: number) {
    const safeLimit = Math.min(50, Math.max(1, Math.floor(limit ?? 10) || 10));
    const groups = await this.prisma.orderItem.groupBy({
      by: ['product_id'],
      where: { order: { status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } } },
      _sum: { quantity: true, total_price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: safeLimit,
    });
    const ids = groups.map((g) => g.product_id);
    const products =
      ids.length === 0
        ? []
        : await this.prisma.product.findMany({
            where: { id: { in: ids } },
            include: { images: { where: { is_primary: true }, take: 1 } },
          });
    const byId = new Map(products.map((p) => [p.id, p]));
    return {
      products: groups.map((g) => {
        const p = byId.get(g.product_id);
        return {
          id: g.product_id,
          name_ar: p?.name_ar ?? null,
          name_en: p?.name_en ?? null,
          image_url:
            (p as Product & { images?: ProductImage[] })?.images?.[0]?.url ?? null,
          units_sold: g._sum.quantity ?? 0,
          revenue: g._sum.total_price ? Number(g._sum.total_price) : 0,
        };
      }),
    };
  }

  // ───────────────────────────────────────────────────────────────────
  // Orders
  // ───────────────────────────────────────────────────────────────────

  async listOrders(filters: Record<string, string>) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (filters.status) {
      if (!Object.values(OrderStatus).includes(filters.status as OrderStatus)) {
        throw new BadRequestException({
          code: 'INVALID_STATUS',
          message_en: 'Unknown order status.',
          message_ar: 'حالة الطلب غير معروفة.',
        });
      }
      where.status = filters.status as OrderStatus;
    }
    if (filters.zone) {
      if (!Object.values(DeliveryZone).includes(filters.zone as DeliveryZone)) {
        throw new BadRequestException({
          code: 'INVALID_ZONE',
          message_en: 'Unknown delivery zone.',
          message_ar: 'منطقة التوصيل غير معروفة.',
        });
      }
      where.address = { zone: filters.zone as DeliveryZone };
    }
    if (filters.from || filters.to) {
      where.created_at = {};
      if (filters.from) where.created_at.gte = new Date(filters.from);
      if (filters.to) where.created_at.lte = new Date(filters.to);
    }
    if (filters.q) {
      const q = filters.q.trim().slice(0, 100);
      where.OR = [
        { order_number: { contains: q, mode: 'insensitive' } },
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { user: { phone: { contains: q } } },
        { address: { full_name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, phone: true } },
          address: { select: { zone: true, district: true, full_name: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        order_number: row.order_number,
        status: row.status as OrderStatus,
        payment_method: row.payment_method,
        payment_status: row.payment_status,
        total: Number(row.total),
        created_at: row.created_at.toISOString(),
        item_count: (row as unknown as { _count: { items: number } })._count.items,
        user: row.user,
        address: row.address,
      })),
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name_ar: true,
                name_en: true,
                slug: true,
                images: { take: 1, orderBy: { sort_order: 'asc' }, select: { url: true } },
              },
            },
          },
        },
        status_history: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message_en: 'Order not found.',
        message_ar: 'لم يتم العثور على الطلب.',
      });
    }
    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status as OrderStatus,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      subtotal: Number(order.subtotal),
      delivery_fee: Number(order.delivery_fee),
      total: Number(order.total),
      receipt_url: order.receipt_url,
      paid_at: order.paid_at?.toISOString() ?? null,
      shipped_at: order.shipped_at?.toISOString() ?? null,
      delivered_at: order.delivered_at?.toISOString() ?? null,
      cancelled_at: order.cancelled_at?.toISOString() ?? null,
      cancellation_reason: order.cancellation_reason,
      notes: order.notes,
      internal_notes: order.internal_notes,
      created_at: order.created_at.toISOString(),
      items: order.items.map((it) => ({
        id: it.id,
        product_id: it.product_id,
        name_ar: it.product.name_ar,
        name_en: it.product.name_en,
        slug: it.product.slug,
        image_url: it.product.images[0]?.url ?? null,
        unit_price: Number(it.unit_price),
        quantity: it.quantity,
        line_total: Number(it.unit_price) * it.quantity,
      })),
      user: order.user,
      address: {
        full_name: order.address.full_name,
        phone: order.address.phone,
        district: order.address.district,
        landmark: order.address.landmark,
        zone: order.address.zone,
      },
      history: order.status_history.map((h) => ({
        id: h.id,
        status: h.status as OrderStatus,
        note: h.note,
        changed_at: h.created_at.toISOString(),
        changed_by_id: h.changed_by_id,
      })),
    };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto, adminId: string) {
    const before = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    const updated = await this.orders.adminUpdateStatus(
      adminId,
      orderId,
      dto.status,
      dto.note,
    );
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.ORDER,
      orderId,
      AUDIT_ACTION.STATUS_CHANGE,
      before ? { status: before.status } : null,
      { status: updated.status, note: dto.note ?? null },
    );
    return updated;
  }

  async updateOrderPayment(orderId: string, dto: UpdateOrderPaymentDto, adminId: string) {
    if (dto.status === ('PAID' as PaymentStatus)) {
      const updated = await this.orders.adminConfirmPayment(adminId, orderId);
      await this.writeAudit(
        adminId,
        AUDIT_ENTITY_TYPE.ORDER,
        orderId,
        AUDIT_ACTION.PAYMENT_CONFIRMED,
        null,
        { status: updated.status, payment_status: updated.payment_status },
      );
      return updated;
    }
    // PaymentStatus enum has no REJECTED member; treat any non-PAID value
    // (UNPAID / REFUNDED) on this endpoint as a "reject receipt" request,
    // which still requires a reason.
    if (!dto.reason) {
      throw new BadRequestException({
        code: 'REJECTION_REASON_REQUIRED',
        message_en: 'A rejection reason is required.',
        message_ar: 'يجب إدخال سبب الرفض.',
      });
    }
    const updated = await this.orders.adminRejectPayment(adminId, orderId, dto.reason);
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.ORDER,
      orderId,
      AUDIT_ACTION.PAYMENT_REJECTED,
      null,
      { status: updated.status, reason: dto.reason },
    );
    return updated;
  }

  // ───────────────────────────────────────────────────────────────────
  // Products
  // ───────────────────────────────────────────────────────────────────

  // ─── Catalog reads (admin scope — includes inactive rows) ──────────

  async getProducts(filters: Record<string, string>) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 25));
    const skip = (page - 1) * limit;

    const status = filters.status?.toLowerCase();
    const where: Prisma.ProductWhereInput = {};
    if (status === 'active') where.is_active = true;
    else if (status === 'inactive') where.is_active = false;
    else if (status === 'out_of_stock') where.stock = { lte: 0 };
    else if (status === 'featured') where.is_featured = true;

    if (filters.category) {
      // accept either id or slug
      const isCuidLike = /^c[a-z0-9]{20,}$/i.test(filters.category);
      where.category = isCuidLike
        ? { id: filters.category }
        : { slug: filters.category };
    }
    if (filters.q) {
      const q = filters.q.trim().slice(0, 100);
      where.OR = [
        { name_ar: { contains: q, mode: 'insensitive' } },
        { name_en: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, rows, all, active, inactive, outOfStock, featured] =
      await this.prisma.$transaction([
        this.prisma.product.count({ where }),
        this.prisma.product.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip,
          take: limit,
          include: {
            category: { select: { id: true, slug: true, name_ar: true, name_en: true } },
            images: {
              where: { is_primary: true },
              take: 1,
              select: { id: true, url: true },
            },
          },
        }),
        this.prisma.product.count(),
        this.prisma.product.count({ where: { is_active: true } }),
        this.prisma.product.count({ where: { is_active: false } }),
        this.prisma.product.count({ where: { stock: { lte: 0 } } }),
        this.prisma.product.count({ where: { is_featured: true } }),
      ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        name_ar: row.name_ar,
        name_en: row.name_en,
        slug: row.slug,
        sku: row.sku,
        price: Number(row.price),
        compare_price: row.compare_price !== null ? Number(row.compare_price) : null,
        stock: row.stock,
        low_stock_threshold: row.low_stock_threshold,
        is_active: row.is_active,
        is_featured: row.is_featured,
        category: row.category,
        primary_image_url: row.images[0]?.url ?? null,
        created_at: row.created_at.toISOString(),
        updated_at: row.updated_at.toISOString(),
      })),
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
      counts: { all, active, inactive, out_of_stock: outOfStock, featured },
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, slug: true, name_ar: true, name_en: true } },
        images: { orderBy: [{ sort_order: 'asc' }, { id: 'asc' }] },
      },
    });
    if (!product) throw this.productNotFoundError();
    return {
      id: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      description_ar: product.description_ar,
      description_en: product.description_en,
      slug: product.slug,
      sku: product.sku,
      price: Number(product.price),
      compare_price: product.compare_price !== null ? Number(product.compare_price) : null,
      stock: product.stock,
      low_stock_threshold: product.low_stock_threshold,
      is_active: product.is_active,
      is_featured: product.is_featured,
      category_id: product.category_id,
      weight_grams: product.weight_grams,
      views_count: product.views_count,
      category: product.category,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt_ar: img.alt_ar,
        alt_en: img.alt_en,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
      })),
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    };
  }

  async getCategories() {
    const rows = await this.prisma.category.findMany({
      orderBy: [{ sort_order: 'asc' }, { name_en: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      name_ar: row.name_ar,
      name_en: row.name_en,
      slug: row.slug,
      parent_id: row.parent_id,
      image_url: row.image_url,
      sort_order: row.sort_order,
      is_active: row.is_active,
      product_count: (row as unknown as { _count: { products: number } })._count.products,
      created_at: row.created_at.toISOString(),
    }));
  }

  async updateProductImage(
    productId: string,
    imageId: string,
    dto: UpdateProductImageDto,
    adminId: string,
  ) {
    const before = await this.prisma.productImage.findFirst({
      where: { id: imageId, product_id: productId },
    });
    if (!before) {
      throw new NotFoundException({
        code: 'IMAGE_NOT_FOUND',
        message_en: 'Image not found for this product.',
        message_ar: 'لم يتم العثور على الصورة لهذا المنتج.',
      });
    }
    const data: Prisma.ProductImageUpdateInput = {};
    if (dto.sort_order !== undefined) data.sort_order = dto.sort_order;
    if (dto.alt_ar !== undefined) data.alt_ar = dto.alt_ar;
    if (dto.alt_en !== undefined) data.alt_en = dto.alt_en;
    if (dto.is_primary === true) data.is_primary = true;
    else if (dto.is_primary === false) data.is_primary = false;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.is_primary === true) {
        await tx.productImage.updateMany({
          where: { product_id: productId, is_primary: true, id: { not: imageId } },
          data: { is_primary: false },
        });
      }
      return tx.productImage.update({ where: { id: imageId }, data });
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.PRODUCT,
      productId,
      AUDIT_ACTION.IMAGE_UPDATE,
      {
        image_id: imageId,
        is_primary: before.is_primary,
        sort_order: before.sort_order,
      },
      {
        image_id: imageId,
        is_primary: updated.is_primary,
        sort_order: updated.sort_order,
      },
    );
    return {
      id: updated.id,
      url: updated.url,
      alt_ar: updated.alt_ar,
      alt_en: updated.alt_en,
      sort_order: updated.sort_order,
      is_primary: updated.is_primary,
    };
  }

  async deleteProductImage(productId: string, imageId: string, adminId: string) {
    const before = await this.prisma.productImage.findFirst({
      where: { id: imageId, product_id: productId },
    });
    if (!before) {
      throw new NotFoundException({
        code: 'IMAGE_NOT_FOUND',
        message_en: 'Image not found for this product.',
        message_ar: 'لم يتم العثور على الصورة لهذا المنتج.',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.productImage.delete({ where: { id: imageId } });
      if (before.is_primary) {
        const next = await tx.productImage.findFirst({
          where: { product_id: productId },
          orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
        });
        if (next) {
          await tx.productImage.update({
            where: { id: next.id },
            data: { is_primary: true },
          });
        }
      }
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.PRODUCT,
      productId,
      AUDIT_ACTION.IMAGE_DELETE,
      { image_id: imageId, is_primary: before.is_primary, url: before.url },
      null,
    );
    return { id: imageId, deleted: true };
  }

  async createProduct(dto: CreateProductDto, adminId: string) {
    await this.requireCategoryExists(dto.category_id);
    try {
      const product = await this.prisma.product.create({
        data: {
          name_ar: dto.name_ar,
          name_en: dto.name_en,
          description_ar: dto.description_ar,
          description_en: dto.description_en,
          slug: dto.slug,
          sku: dto.sku ?? null,
          price: new Prisma.Decimal(dto.price),
          compare_price:
            dto.compare_price !== undefined ? new Prisma.Decimal(dto.compare_price) : null,
          stock: dto.stock,
          is_active: dto.is_active ?? true,
          is_featured: dto.is_featured ?? false,
          category_id: dto.category_id,
          weight_grams: dto.weight_grams ?? null,
        },
      });
      await this.writeAudit(
        adminId,
        AUDIT_ENTITY_TYPE.PRODUCT,
        product.id,
        AUDIT_ACTION.CREATE,
        null,
        sanitizeProductForAudit(product),
      );
      return product;
    } catch (err) {
      this.rethrowUniqueViolation(err);
      throw err;
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto, adminId: string) {
    const before = await this.prisma.product.findUnique({ where: { id } });
    if (!before) throw this.productNotFoundError();
    if (dto.category_id !== undefined) await this.requireCategoryExists(dto.category_id);
    const data: Prisma.ProductUpdateInput = {};
    if (dto.name_ar !== undefined) data.name_ar = dto.name_ar;
    if (dto.name_en !== undefined) data.name_en = dto.name_en;
    if (dto.description_ar !== undefined) data.description_ar = dto.description_ar;
    if (dto.description_en !== undefined) data.description_en = dto.description_en;
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.category_id !== undefined) data.category = { connect: { id: dto.category_id } };
    if (dto.is_active !== undefined) data.is_active = dto.is_active;
    if (dto.is_featured !== undefined) data.is_featured = dto.is_featured;
    try {
      const after = await this.prisma.product.update({ where: { id }, data });
      if (dto.stock !== undefined && dto.stock !== before.stock) {
        const delta = after.stock - before.stock;
        try {
          await this.prisma.inventoryMovement.create({
            data: {
              product_id: id,
              sku: after.sku,
              type: delta > 0 ? 'RESTOCK' : 'ADJUST',
              quantity: delta,
              stock_after: after.stock,
              reference: 'manual edit',
              actor_id: adminId,
            },
          });
        } catch (logErr) {
          this.logger.warn(
            `inventory_movement ${delta > 0 ? 'RESTOCK' : 'ADJUST'} insert failed for product ${id}: ${(logErr as Error).message}`,
          );
        }
      }
      await this.writeAudit(
        adminId,
        AUDIT_ENTITY_TYPE.PRODUCT,
        id,
        AUDIT_ACTION.UPDATE,
        sanitizeProductForAudit(before),
        sanitizeProductForAudit(after),
      );
      return after;
    } catch (err) {
      this.rethrowUniqueViolation(err);
      throw err;
    }
  }

  async deleteProduct(id: string, adminId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw this.productNotFoundError();
    if (!product.is_active) {
      throw new ConflictException({
        code: 'PRODUCT_ALREADY_DELETED',
        message_en: 'Product is already deactivated.',
        message_ar: 'المنتج معطل بالفعل.',
      });
    }
    const after = await this.prisma.product.update({
      where: { id },
      data: { is_active: false },
    });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.PRODUCT,
      id,
      AUDIT_ACTION.SOFT_DELETE,
      { is_active: true },
      { is_active: false },
    );
    return { id: after.id, is_active: after.is_active };
  }

  async uploadProductImages(
    productId: string,
    file: Express.Multer.File,
    dto: UploadProductImageDto,
    adminId: string,
  ) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw this.productNotFoundError();

    const { key, url } = await this.storage.uploadProductImage(file);

    const created = await this.prisma.$transaction(async (tx) => {
      if (dto.is_primary) {
        await tx.productImage.updateMany({
          where: { product_id: productId, is_primary: true },
          data: { is_primary: false },
        });
      }
      return tx.productImage.create({
        data: {
          product_id: productId,
          url,
          sort_order: dto.sort_order ?? 0,
          is_primary: dto.is_primary ?? false,
        },
      });
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.PRODUCT,
      productId,
      AUDIT_ACTION.IMAGE_UPLOAD,
      null,
      { image_id: created.id, key, url, is_primary: created.is_primary, sort_order: created.sort_order },
    );
    return created;
  }

  // ───────────────────────────────────────────────────────────────────
  // Categories
  // ───────────────────────────────────────────────────────────────────

  async createCategory(dto: CreateCategoryDto, adminId: string) {
    if (dto.parent_id) await this.requireCategoryExists(dto.parent_id);
    try {
      const category = await this.prisma.category.create({
        data: {
          name_ar: dto.name_ar,
          name_en: dto.name_en,
          slug: dto.slug,
          parent_id: dto.parent_id ?? null,
          sort_order: dto.sort_order ?? 0,
        },
      });
      await this.writeAudit(
        adminId,
        AUDIT_ENTITY_TYPE.CATEGORY,
        category.id,
        AUDIT_ACTION.CREATE,
        null,
        category,
      );
      return category;
    } catch (err) {
      this.rethrowUniqueViolation(err);
      throw err;
    }
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, adminId: string) {
    const before = await this.prisma.category.findUnique({ where: { id } });
    if (!before) throw this.categoryNotFoundError();
    if (dto.parent_id !== undefined && dto.parent_id !== null) {
      await this.requireCategoryExists(dto.parent_id);
      await this.guardAgainstCategoryCycle(id, dto.parent_id);
    }
    const data: Prisma.CategoryUpdateInput = {};
    if (dto.name_ar !== undefined) data.name_ar = dto.name_ar;
    if (dto.name_en !== undefined) data.name_en = dto.name_en;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.sort_order !== undefined) data.sort_order = dto.sort_order;
    if (dto.is_active !== undefined) data.is_active = dto.is_active;
    if (dto.parent_id !== undefined) {
      data.parent = dto.parent_id ? { connect: { id: dto.parent_id } } : { disconnect: true };
    }
    try {
      const after = await this.prisma.category.update({ where: { id }, data });
      await this.writeAudit(
        adminId,
        AUDIT_ENTITY_TYPE.CATEGORY,
        id,
        AUDIT_ACTION.UPDATE,
        before,
        after,
      );
      return after;
    } catch (err) {
      this.rethrowUniqueViolation(err);
      throw err;
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // Customers
  // ───────────────────────────────────────────────────────────────────

  async listCustomers(page?: number, limit?: number, q?: string) {
    const safePage = Math.max(1, Math.floor(page ?? 1) || 1);
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit ?? 20) || 20));
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.UserWhereInput = { role: 'CUSTOMER' };
    if (q) {
      const term = q.trim().slice(0, 100);
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term } },
        { email: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: safeLimit,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          language: true,
          is_active: true,
          created_at: true,
          _count: { select: { orders: true } },
        },
      }),
    ]);

    const ids = rows.map((r) => r.id);
    const lastOrders =
      ids.length === 0
        ? []
        : await this.prisma.order.groupBy({
            by: ['user_id'],
            where: { user_id: { in: ids } },
            _max: { created_at: true },
          });
    const lastById = new Map(lastOrders.map((g) => [g.user_id, g._max.created_at]));

    return {
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        language: row.language,
        is_active: row.is_active,
        created_at: row.created_at.toISOString(),
        order_count: row._count.orders,
        last_order_at: lastById.get(row.id)?.toISOString() ?? null,
      })),
      page: safePage,
      limit: safeLimit,
      total,
      total_pages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  async customerDetail(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, role: 'CUSTOMER' },
      include: {
        addresses: true,
        orders: {
          orderBy: { created_at: 'desc' },
          take: 10,
          include: {
            address: { select: { zone: true, district: true } },
            _count: { select: { items: true } },
          },
        },
        _count: { select: { orders: true } },
      },
    });
    if (!user) {
      throw new NotFoundException({
        code: 'CUSTOMER_NOT_FOUND',
        message_en: 'Customer not found.',
        message_ar: 'العميل غير موجود.',
      });
    }
    const totalSpent = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: {
        user_id: id,
        status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] },
      },
    });
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      language: user.language,
      is_active: user.is_active,
      created_at: user.created_at.toISOString(),
      order_count: user._count.orders,
      total_spent: totalSpent._sum.total ? Number(totalSpent._sum.total) : 0,
      addresses: user.addresses,
      recent_orders: user.orders.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total: Number(order.total),
        created_at: order.created_at.toISOString(),
        item_count: (order as unknown as { _count: { items: number } })._count.items,
        zone: order.address?.zone ?? null,
        district: order.address?.district ?? null,
      })),
    };
  }

  // ───────────────────────────────────────────────────────────────────
  // Delivery
  // ───────────────────────────────────────────────────────────────────

  async updateZoneFee(zone: DeliveryZone, dto: UpdateZoneFeeDto, adminId: string) {
    if (!Object.values(DeliveryZone).includes(zone)) {
      throw new BadRequestException({
        code: 'INVALID_ZONE',
        message_en: 'Unknown delivery zone.',
        message_ar: 'منطقة التوصيل غير معروفة.',
      });
    }
    if (dto.estimated_days_min > dto.estimated_days_max) {
      throw new BadRequestException({
        code: 'INVALID_ETA_RANGE',
        message_en: 'estimated_days_min must be less than or equal to estimated_days_max.',
        message_ar: 'الحد الأدنى لأيام التوصيل يجب ألا يتجاوز الحد الأعلى.',
      });
    }
    if (dto.fee < 0 || (dto.free_above !== undefined && dto.free_above < 0)) {
      throw new BadRequestException({
        code: 'INVALID_FEE',
        message_en: 'Fees must be non-negative.',
        message_ar: 'الرسوم يجب أن تكون موجبة.',
      });
    }
    const before = await this.prisma.deliveryZoneFee.findUnique({ where: { zone } });
    const data = {
      zone,
      fee: new Prisma.Decimal(dto.fee),
      free_above: dto.free_above !== undefined ? new Prisma.Decimal(dto.free_above) : null,
      estimated_days_min: dto.estimated_days_min,
      estimated_days_max: dto.estimated_days_max,
    };
    const after = await this.prisma.deliveryZoneFee.upsert({
      where: { zone },
      update: data,
      create: data,
    });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.DELIVERY_ZONE_FEE,
      zone,
      AUDIT_ACTION.ZONE_FEE_UPDATE,
      before ? sanitizeZoneForAudit(before) : null,
      sanitizeZoneForAudit(after),
    );
    return sanitizeZoneForAudit(after);
  }

  // ───────────────────────────────────────────────────────────────────
  // Settings
  // ───────────────────────────────────────────────────────────────────

  async getSettings(): Promise<Record<string, string>> {
    const rows = await this.prisma.appSetting.findMany();
    return rows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }

  async updateSettings(dto: UpdateSettingsDto, adminId: string) {
    const entries = Object.entries(dto.settings ?? {});
    if (entries.length === 0) {
      throw new BadRequestException({
        code: 'EMPTY_SETTINGS',
        message_en: 'No settings provided.',
        message_ar: 'لم يتم تقديم أي إعدادات.',
      });
    }
    if (entries.length > MAX_SETTINGS_KEYS_PER_CALL) {
      throw new BadRequestException({
        code: 'TOO_MANY_SETTINGS',
        message_en: `Cannot update more than ${MAX_SETTINGS_KEYS_PER_CALL} settings per call.`,
        message_ar: `لا يمكن تحديث أكثر من ${MAX_SETTINGS_KEYS_PER_CALL} إعداد في وقت واحد.`,
      });
    }
    for (const [key, value] of entries) {
      if (!SETTING_KEY_REGEX.test(key)) {
        throw new BadRequestException({
          code: 'INVALID_SETTING_KEY',
          message_en: `Invalid setting key: ${key}`,
          message_ar: `مفتاح الإعداد غير صالح: ${key}`,
        });
      }
      if (typeof value !== 'string') {
        throw new BadRequestException({
          code: 'INVALID_SETTING_VALUE',
          message_en: `Setting value for ${key} must be a string.`,
          message_ar: 'قيمة الإعداد يجب أن تكون نصاً.',
        });
      }
      if (Buffer.byteLength(value, 'utf8') > MAX_SETTINGS_VALUE_BYTES) {
        throw new BadRequestException({
          code: 'SETTING_VALUE_TOO_LARGE',
          message_en: `Setting value for ${key} exceeds ${MAX_SETTINGS_VALUE_BYTES} bytes.`,
          message_ar: 'قيمة الإعداد تتجاوز الحد المسموح.',
        });
      }
    }

    const beforeRows = await this.prisma.appSetting.findMany({
      where: { key: { in: entries.map(([k]) => k) } },
    });
    const before: Record<string, string> = {};
    for (const row of beforeRows) before[row.key] = row.value;

    await this.prisma.$transaction(
      entries.map(([key, value]) =>
        this.prisma.appSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.APP_SETTING,
      '*',
      AUDIT_ACTION.SETTINGS_UPDATE,
      before,
      dto.settings,
    );

    return { settings: await this.getSettings() };
  }

  // ───────────────────────────────────────────────────────────────────
  // Reviews moderation
  // ───────────────────────────────────────────────────────────────────

  async listReviews(query: ListAdminReviewsQueryDto) {
    const page = Math.max(1, Math.floor(query.page ?? 1) || 1);
    const limit = Math.min(100, Math.max(1, Math.floor(query.limit ?? 20) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};
    switch (query.status ?? 'pending') {
      case 'pending':
        where.moderation_status = 'PENDING';
        where.flagged_reason = null;
        break;
      case 'flagged':
        where.moderation_status = 'PENDING';
        where.flagged_reason = { not: null };
        break;
      case 'approved':
        where.moderation_status = 'APPROVED';
        break;
      case 'rejected':
        where.moderation_status = 'REJECTED';
        break;
      case 'all':
      default:
        break;
    }

    if (query.search) {
      const term = query.search.trim().slice(0, 100);
      where.OR = [
        { comment: { contains: term, mode: 'insensitive' } },
        { user: { name: { contains: term, mode: 'insensitive' } } },
        { product: { name_en: { contains: term, mode: 'insensitive' } } },
        { product: { name_ar: { contains: term } } },
      ];
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, phone: true } },
          product: { select: { id: true, name_en: true, name_ar: true, sku: true, slug: true } },
        },
      }),
    ]);

    return {
      items: rows.map((r) => ({
        id: r.id,
        product: r.product,
        user: r.user,
        rating: r.rating,
        comment: r.comment,
        is_verified_purchase: r.is_verified_purchase,
        moderation_status: r.moderation_status,
        flagged_reason: r.flagged_reason,
        rejection_reason: r.rejection_reason,
        moderated_at: r.moderated_at?.toISOString() ?? null,
        moderated_by: r.moderated_by,
        created_at: r.created_at.toISOString(),
      })),
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async reviewKpis() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [pending, flagged, approvedThisMonth, ratingAgg, totalCount, verifiedCount, responseAgg] =
      await Promise.all([
        this.prisma.review.count({
          where: { moderation_status: 'PENDING', flagged_reason: null },
        }),
        this.prisma.review.count({
          where: { moderation_status: 'PENDING', flagged_reason: { not: null } },
        }),
        this.prisma.review.count({
          where: { moderation_status: 'APPROVED', moderated_at: { gte: startOfMonth } },
        }),
        this.prisma.review.aggregate({
          _avg: { rating: true },
          where: {
            moderation_status: 'APPROVED',
            created_at: { gte: thirtyDaysAgo },
          },
        }),
        this.prisma.review.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
        this.prisma.review.count({
          where: { is_verified_purchase: true, created_at: { gte: thirtyDaysAgo } },
        }),
        this.prisma.$queryRaw<Array<{ avg_seconds: number | null }>>`
          SELECT EXTRACT(EPOCH FROM AVG("moderated_at" - "created_at")) AS avg_seconds
          FROM "reviews"
          WHERE "moderated_at" IS NOT NULL
            AND "moderated_at" >= ${thirtyDaysAgo}
        `,
      ]);

    const avgRating =
      ratingAgg._avg.rating !== null && ratingAgg._avg.rating !== undefined
        ? Math.round(ratingAgg._avg.rating * 10) / 10
        : null;
    const verifiedPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : null;
    const avgSeconds = responseAgg[0]?.avg_seconds;
    const avgResponseHours =
      avgSeconds !== null && avgSeconds !== undefined
        ? Math.round((Number(avgSeconds) / 3600) * 10) / 10
        : null;

    return {
      pending,
      flagged,
      approvedThisMonth,
      avgRating30d: avgRating,
      verifiedBuyerPct: verifiedPct,
      avgResponseHours,
    };
  }

  async approveReview(id: string, adminId: string) {
    const before = await this.prisma.review.findUnique({
      where: { id },
      select: this.reviewAuditSelect(),
    });
    if (!before) throw this.reviewNotFoundError();

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        moderation_status: 'APPROVED',
        moderated_by: adminId,
        moderated_at: new Date(),
        rejection_reason: null,
      },
      select: this.reviewAuditSelect(),
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.REVIEW,
      id,
      AUDIT_ACTION.REVIEW_APPROVED,
      before,
      updated,
    );
    return { id, moderation_status: updated.moderation_status };
  }

  async rejectReview(id: string, dto: RejectReviewDto, adminId: string) {
    const before = await this.prisma.review.findUnique({
      where: { id },
      select: this.reviewAuditSelect(),
    });
    if (!before) throw this.reviewNotFoundError();

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        moderation_status: 'REJECTED',
        moderated_by: adminId,
        moderated_at: new Date(),
        rejection_reason: dto.reason,
      },
      select: this.reviewAuditSelect(),
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.REVIEW,
      id,
      AUDIT_ACTION.REVIEW_REJECTED,
      before,
      updated,
    );
    return { id, moderation_status: updated.moderation_status, rejection_reason: dto.reason };
  }

  async resetReviewToPending(id: string, adminId: string) {
    const before = await this.prisma.review.findUnique({
      where: { id },
      select: this.reviewAuditSelect(),
    });
    if (!before) throw this.reviewNotFoundError();

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        moderation_status: 'PENDING',
        moderated_by: null,
        moderated_at: null,
        rejection_reason: null,
      },
      select: this.reviewAuditSelect(),
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.REVIEW,
      id,
      AUDIT_ACTION.REVIEW_RESET_TO_PENDING,
      before,
      updated,
    );
    return { id, moderation_status: updated.moderation_status };
  }

  // ───────────────────────────────────────────────────────────────────
  // Staff + audit log
  // ───────────────────────────────────────────────────────────────────

  async listStaff() {
    const rows = await this.prisma.user.findMany({
      where: { role: 'ADMIN', is_active: true },
      orderBy: [{ last_login_at: { sort: 'desc', nulls: 'last' } }, { created_at: 'desc' }],
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        last_login_at: true,
        created_at: true,
      },
    });
    return {
      items: rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        role: r.role,
        last_login_at: r.last_login_at?.toISOString() ?? null,
        created_at: r.created_at.toISOString(),
      })),
    };
  }

  async listAuditFeed(query: ListAuditFeedQueryDto) {
    const limit = Math.min(100, Math.max(1, Math.floor(query.limit ?? 50) || 50));
    const where: Prisma.AuditLogWhereInput = {};
    if (query.entity_type) where.entity_type = query.entity_type;
    if (query.actor_id) where.actor_id = query.actor_id;

    const rows = await this.prisma.auditLog.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      include: { actor: { select: { id: true, name: true } } },
    });

    return {
      items: rows.map((r) => ({
        id: r.id,
        actor: { id: r.actor.id, name: r.actor.name },
        entity_type: r.entity_type,
        entity_id: r.entity_id,
        action: r.action,
        created_at: r.created_at.toISOString(),
      })),
    };
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  private async requireCategoryExists(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw this.categoryNotFoundError();
    return category;
  }

  private async guardAgainstCategoryCycle(
    selfId: string,
    proposedParentId: string,
  ): Promise<void> {
    if (selfId === proposedParentId) {
      throw new ConflictException({
        code: 'CATEGORY_CYCLE',
        message_en: 'A category cannot be its own parent.',
        message_ar: 'لا يمكن للفئة أن تكون أبا لنفسها.',
      });
    }
    let currentId: string | null = proposedParentId;
    for (let depth = 0; depth < CATEGORY_MAX_DEPTH; depth++) {
      const current: { parent_id: string | null } | null = currentId
        ? await this.prisma.category.findUnique({
            where: { id: currentId },
            select: { parent_id: true },
          })
        : null;
      if (!current) return;
      if (current.parent_id === selfId) {
        throw new ConflictException({
          code: 'CATEGORY_CYCLE',
          message_en: 'Setting this parent would create a category cycle.',
          message_ar: 'هذا التغيير ينشئ دورة بين الفئات.',
        });
      }
      currentId = current.parent_id;
    }
  }

  private categoryNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'CATEGORY_NOT_FOUND',
      message_en: 'Category not found.',
      message_ar: 'الفئة غير موجودة.',
    });
  }

  private productNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'PRODUCT_NOT_FOUND',
      message_en: 'Product not found.',
      message_ar: 'المنتج غير موجود.',
    });
  }

  private reviewNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'REVIEW_NOT_FOUND',
      message_en: 'Review not found.',
      message_ar: 'التقييم غير موجود.',
    });
  }

  private reviewAuditSelect() {
    return {
      id: true,
      moderation_status: true,
      flagged_reason: true,
      rejection_reason: true,
      moderated_by: true,
      moderated_at: true,
    } as const;
  }

  private rethrowUniqueViolation(err: unknown): void {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return;
    if (err.code !== 'P2002') return;
    const target = err.meta?.target;
    const targetStr = Array.isArray(target) ? target.join(',') : String(target ?? '');
    if (targetStr.includes('slug')) {
      throw new ConflictException({
        code: 'SLUG_EXISTS',
        message_en: 'A record with this slug already exists.',
        message_ar: 'هناك سجل بنفس الاسم المعرّف بالفعل.',
      });
    }
    if (targetStr.includes('sku')) {
      throw new ConflictException({
        code: 'SKU_EXISTS',
        message_en: 'A product with this SKU already exists.',
        message_ar: 'هناك منتج بنفس رمز SKU بالفعل.',
      });
    }
  }

  private async writeAudit(
    actorId: string,
    entityType: AuditEntityType,
    entityId: string,
    action: AuditAction,
    before: object | null,
    after: object | null,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actor_id: actorId,
          entity_type: entityType,
          entity_id: entityId,
          action,
          before: (before as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          after: (after as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        },
      });
    } catch (err) {
      this.logger.error(
        `audit_log write failed (${action} ${entityType} ${entityId}): ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }

  private async dailyRevenueRange(
    start: Date,
    end: Date,
  ): Promise<Array<{ date: string; revenue: number; order_count: number }>> {
    const rows = await this.prisma.$queryRaw<
      Array<{ date: Date; revenue: string; order_count: bigint }>
    >`
      SELECT
        date_trunc('day', created_at)::date AS date,
        COALESCE(SUM(total), 0)::text AS revenue,
        COUNT(*) AS order_count
      FROM orders
      WHERE created_at >= ${start}
        AND created_at <= ${end}
        AND status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    return rows.map((r) => ({
      date: r.date.toISOString().slice(0, 10),
      revenue: Number(r.revenue),
      order_count: Number(r.order_count),
    }));
  }

  private async dailyRevenueByZone(
    start: Date,
    end: Date,
  ): Promise<Array<{ date: string; zone: DeliveryZone; revenue: number; order_count: number }>> {
    const rows = await this.prisma.$queryRaw<
      Array<{ date: Date; zone: string; revenue: string; order_count: bigint }>
    >`
      SELECT
        date_trunc('day', o.created_at)::date AS date,
        a.zone AS zone,
        COALESCE(SUM(o.total), 0)::text AS revenue,
        COUNT(*) AS order_count
      FROM orders o
      JOIN addresses a ON a.id = o.address_id
      WHERE o.created_at >= ${start}
        AND o.created_at <= ${end}
        AND o.status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY 1, 2
      ORDER BY 1 ASC, 2 ASC
    `;
    return rows.map((r) => ({
      date: r.date.toISOString().slice(0, 10),
      zone: r.zone as DeliveryZone,
      revenue: Number(r.revenue),
      order_count: Number(r.order_count),
    }));
  }

  // ───────────────────────────────────────────────────────────────────
  // Inventory movements (Slice 3b-1)
  // ───────────────────────────────────────────────────────────────────

  async getInventoryMovements(query: InventoryMovementsQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryMovementWhereInput = {};
    if (query.type) where.type = query.type;
    if (query.product_id) where.product_id = query.product_id;
    if (query.from || query.to) {
      const range: Prisma.DateTimeFilter = {};
      if (query.from) {
        const d = new Date(query.from);
        if (Number.isNaN(d.getTime())) throw this.invalidDateError();
        range.gte = d;
      }
      if (query.to) {
        const d = new Date(query.to);
        if (Number.isNaN(d.getTime())) throw this.invalidDateError();
        range.lte = d;
      }
      where.created_at = range;
    }

    const [items, total] = await Promise.all([
      this.prisma.inventoryMovement.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          product: { select: { id: true, name_ar: true, name_en: true, sku: true } },
          actor: { select: { id: true, name: true } },
        },
      }),
      this.prisma.inventoryMovement.count({ where }),
    ]);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const [today_count, net_change_agg, lowStockRows] = await Promise.all([
      this.prisma.inventoryMovement.count({ where: { created_at: { gte: startOfToday } } }),
      this.prisma.inventoryMovement.aggregate({
        where: { created_at: { gte: startOfToday } },
        _sum: { quantity: true },
      }),
      this.prisma.$queryRaw<Array<{ c: bigint }>>`
        SELECT COUNT(*)::bigint AS c FROM products
        WHERE is_active = true AND stock <= low_stock_threshold
      `,
    ]);
    const low_stock_count = Number(lowStockRows[0]?.c ?? 0);

    return {
      items: items.map((m) => ({
        id: m.id,
        product_id: m.product_id,
        product_name_ar: m.product.name_ar,
        product_name_en: m.product.name_en,
        sku: m.sku,
        type: m.type,
        quantity: m.quantity,
        stock_after: m.stock_after,
        reference: m.reference,
        actor_id: m.actor_id,
        actor_name: m.actor?.name ?? null,
        created_at: m.created_at.toISOString(),
      })),
      total,
      page,
      limit,
      kpis: {
        today_count,
        net_change_today: net_change_agg._sum.quantity ?? 0,
        low_stock_count,
        pending_pos: 0,
      },
    };
  }

  // ───────────────────────────────────────────────────────────────────
  // Abandoned carts (Slice 3b-1)
  // ───────────────────────────────────────────────────────────────────

  async getAbandonedCarts(query: AbandonedCartsQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const skip = (page - 1) * limit;
    const minAgeHours = Math.max(0, query.min_age_hours ?? 1);
    const cutoff = new Date(Date.now() - minAgeHours * 60 * 60 * 1000);

    const baseWhere: Prisma.CartSessionWhereInput = {
      updated_at: { lte: cutoff },
      user: {
        is_active: true,
      },
      NOT: {
        user: {
          orders: { some: {} },
        },
      },
    };

    const allSessions = await this.prisma.cartSession.findMany({
      where: baseWhere,
      orderBy: { updated_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            addresses: { where: { is_default: true }, take: 1 },
          },
        },
      },
    });

    const productIds = new Set<string>();
    for (const s of allSessions) {
      const items = (s.items as unknown as Array<{ product_id: string; quantity: number }>) ?? [];
      for (const it of items) productIds.add(it.product_id);
    }
    const products =
      productIds.size === 0
        ? []
        : await this.prisma.product.findMany({
            where: { id: { in: Array.from(productIds) } },
            select: { id: true, name_ar: true, name_en: true, price: true },
          });
    const productById = new Map(products.map((p) => [p.id, p]));

    const enriched = allSessions.map((s) => {
      const items = (s.items as unknown as Array<{ product_id: string; quantity: number }>) ?? [];
      let totalQty = 0;
      let totalValue = 0;
      for (const it of items) {
        const p = productById.get(it.product_id);
        totalQty += it.quantity;
        if (p) totalValue += Number(p.price) * it.quantity;
      }
      const hasDefaultAddress = s.user.addresses.length > 0;
      const stage: 'cart' | 'address' | 'payment' = hasDefaultAddress ? 'address' : 'cart';
      const ageMs = Date.now() - s.updated_at.getTime();
      const ageHours = ageMs / (60 * 60 * 1000);
      const recovery_score: 'hot' | 'warm' | 'cold' =
        totalQty >= 3 || totalValue > 200_000
          ? 'hot'
          : totalQty >= 1 && ageHours < 6
            ? 'warm'
            : 'cold';
      return {
        user_id: s.user_id,
        user_name: s.user.name,
        user_phone: s.user.phone,
        items_count: totalQty,
        cart_value: totalValue,
        stage,
        recovery_score,
        updated_at: s.updated_at.toISOString(),
        age_hours: Math.round(ageHours * 10) / 10,
        last_event: items.length === 0 ? 'Empty cart' : `${items.length} line(s)`,
      };
    });

    const filtered = query.stage ? enriched.filter((c) => c.stage === query.stage) : enriched;

    const summary = {
      active_carts: filtered.length,
      recoverable_value_sdg: filtered.reduce((sum, c) => sum + c.cart_value, 0),
      items_in_carts: filtered.reduce((sum, c) => sum + c.items_count, 0),
    };

    return {
      items: filtered.slice(skip, skip + limit),
      total: filtered.length,
      page,
      limit,
      summary,
    };
  }

  private invalidDateError() {
    return new BadRequestException({
      code: 'INVALID_DATE',
      message_en: 'from/to must be valid ISO dates.',
      message_ar: 'تواريخ النطاق غير صالحة.',
    });
  }

  // ───────────────────────────────────────────────────────────────────
  // Refunds (Slice 3b-2)
  // ───────────────────────────────────────────────────────────────────

  async listRefunds(query: ListRefundsQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const skip = (page - 1) * limit;

    const where: Prisma.RefundRequestWhereInput = {};
    if (query.status && query.status !== 'all') {
      where.status = query.status.toUpperCase() as RefundStatus;
    }

    const [items, total, pending, approved, rejected] = await this.prisma.$transaction([
      this.prisma.refundRequest.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              order_number: true,
              total: true,
              user: { select: { id: true, name: true, phone: true } },
            },
          },
          requested_by: { select: { id: true, name: true } },
          decided_by: { select: { id: true, name: true } },
        },
      }),
      this.prisma.refundRequest.count({ where }),
      this.prisma.refundRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.refundRequest.count({ where: { status: 'APPROVED' } }),
      this.prisma.refundRequest.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      items: items.map((r) => ({
        id: r.id,
        refund_number: r.refund_number,
        order_id: r.order_id,
        order_number: r.order.order_number,
        customer_name: r.order.user.name,
        customer_phone: r.order.user.phone,
        amount: Number(r.amount),
        reason: r.reason,
        status: r.status,
        rejection_reason: r.rejection_reason,
        requested_by: r.requested_by.name,
        decided_by: r.decided_by?.name ?? null,
        decided_at: r.decided_at?.toISOString() ?? null,
        created_at: r.created_at.toISOString(),
      })),
      total,
      page,
      limit,
      counts: { pending, approved, rejected, all: pending + approved + rejected },
    };
  }

  async createRefund(dto: CreateRefundDto, adminId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.order_id } });
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message_en: 'Order not found.',
        message_ar: 'الطلب غير موجود.',
      });
    }
    if (
      order.payment_status !== PaymentStatus.PAID ||
      !refundEligibleStatuses.has(order.status as OrderStatus)
    ) {
      throw new ConflictException({
        code: 'ORDER_NOT_REFUNDABLE',
        message_en: 'Order is not in a refundable state.',
        message_ar: 'لا يمكن استرداد هذا الطلب في حالته الحالية.',
      });
    }
    const existing = await this.prisma.refundRequest.findFirst({
      where: {
        order_id: dto.order_id,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });
    if (existing) {
      throw new ConflictException({
        code: 'REFUND_ALREADY_EXISTS',
        message_en: 'A refund is already pending or approved for this order.',
        message_ar: 'هناك استرداد قيد المعالجة لهذا الطلب.',
      });
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      const refundNumber = await nextRefundNumber(this.prisma);
      try {
        const created = await this.prisma.refundRequest.create({
          data: {
            refund_number: refundNumber,
            order_id: dto.order_id,
            amount: new Prisma.Decimal(dto.amount),
            reason: dto.reason,
            requested_by_id: adminId,
          },
        });
        await this.writeAudit(
          adminId,
          AUDIT_ENTITY_TYPE.REFUND,
          created.id,
          AUDIT_ACTION.CREATE,
          null,
          {
            refund_number: refundNumber,
            order_id: dto.order_id,
            amount: dto.amount,
            reason: dto.reason,
          },
        );
        return {
          id: created.id,
          refund_number: created.refund_number,
          status: created.status,
          amount: Number(created.amount),
        };
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002' &&
          attempt === 0
        ) {
          this.logger.warn(
            `refund_number ${refundNumber} collided on attempt ${attempt + 1}; retrying`,
          );
          continue;
        }
        throw err;
      }
    }
    throw new ConflictException({
      code: 'REFUND_NUMBER_COLLISION',
      message_en: 'Could not assign a unique refund number. Please retry.',
      message_ar: 'تعذّر إنشاء رقم فريد للاسترداد. حاول مرة أخرى.',
    });
  }

  async approveRefund(id: string, adminId: string) {
    const refund = await this.prisma.refundRequest.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!refund) {
      throw new NotFoundException({
        code: 'REFUND_NOT_FOUND',
        message_en: 'Refund not found.',
        message_ar: 'الاسترداد غير موجود.',
      });
    }
    if (refund.status !== 'PENDING') {
      throw new ConflictException({
        code: 'REFUND_NOT_PENDING',
        message_en: 'Refund is not pending.',
        message_ar: 'لم يعد الاسترداد قيد الانتظار.',
      });
    }
    if (!canTransition(refund.order.status as OrderStatus, OrderStatus.REFUNDED)) {
      throw new ConflictException({
        code: 'INVALID_STATUS_TRANSITION',
        message_en: `Order in status ${refund.order.status} cannot transition to REFUNDED.`,
        message_ar: 'لا يمكن تحويل حالة الطلب إلى مسترد من الحالة الحالية.',
      });
    }

    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.refundRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          decided_by_id: adminId,
          decided_at: now,
        },
      });
      await tx.order.update({
        where: { id: refund.order_id },
        data: {
          status: OrderStatus.REFUNDED,
          payment_status: PaymentStatus.REFUNDED,
          refunded_at: now,
        },
      });
      await tx.orderStatusHistory.create({
        data: {
          order_id: refund.order_id,
          status: OrderStatus.REFUNDED,
          changed_by_id: adminId,
          note: `Refund ${refund.refund_number} approved`,
        },
      });
    });

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.REFUND,
      id,
      AUDIT_ACTION.REFUND_APPROVED,
      { status: 'PENDING' },
      { status: 'APPROVED', order_status: OrderStatus.REFUNDED },
    );

    // Post-commit SMS, fire-and-forget.
    const user = await this.prisma.user.findUnique({ where: { id: refund.order.user_id } });
    if (user) {
      const ctx: OrderSmsContext = {
        orderNumber: refund.order.order_number,
        total: Number(refund.amount),
      };
      try {
        const body = pickOrderSms('ORDER_REFUNDED', user.language, ctx);
        await this.notifications.sendSms(user.phone, body);
      } catch (err) {
        this.logger.warn(
          `ORDER_REFUNDED SMS dispatch failed for ${user.phone}: ${(err as Error).message}`,
        );
      }
    }

    return { id, status: 'APPROVED' as const };
  }

  async rejectRefund(id: string, dto: RejectRefundDto, adminId: string) {
    const refund = await this.prisma.refundRequest.findUnique({ where: { id } });
    if (!refund) {
      throw new NotFoundException({
        code: 'REFUND_NOT_FOUND',
        message_en: 'Refund not found.',
        message_ar: 'الاسترداد غير موجود.',
      });
    }
    if (refund.status !== 'PENDING') {
      throw new ConflictException({
        code: 'REFUND_NOT_PENDING',
        message_en: 'Refund is not pending.',
        message_ar: 'لم يعد الاسترداد قيد الانتظار.',
      });
    }
    const now = new Date();
    await this.prisma.refundRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejection_reason: dto.reason,
        decided_by_id: adminId,
        decided_at: now,
      },
    });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.REFUND,
      id,
      AUDIT_ACTION.REFUND_REJECTED,
      { status: 'PENDING' },
      { status: 'REJECTED', rejection_reason: dto.reason },
    );
    return { id, status: 'REJECTED' as const };
  }

  // ───────────────────────────────────────────────────────────────────
  // Shipping labels (Slice 3b-2)
  // ───────────────────────────────────────────────────────────────────

  async listShippingLabels(query: ListShippingLabelsQueryDto) {
    const status = query.status ?? 'ready';
    const where: Prisma.OrderWhereInput =
      status === 'ready'
        ? {
            status: { in: [OrderStatus.PAYMENT_CONFIRMED, OrderStatus.PROCESSING] },
            label_printed_at: null,
          }
        : status === 'printed'
          ? { label_printed_at: { not: null } }
          : {
              OR: [
                {
                  status: { in: [OrderStatus.PAYMENT_CONFIRMED, OrderStatus.PROCESSING] },
                },
                { label_printed_at: { not: null } },
              ],
            };

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: [{ label_printed_at: 'asc' }, { created_at: 'asc' }],
      take: 200,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        address: true,
        items: { select: { id: true, quantity: true } },
      },
    });

    return {
      items: orders.map((o) => {
        const items_count = o.items.reduce((sum, it) => sum + it.quantity, 0);
        return {
          id: o.id,
          order_number: o.order_number,
          tracking_number: o.tracking_number,
          status: o.status,
          payment_method: o.payment_method,
          is_cod: o.payment_method === 'CASH_ON_DELIVERY',
          total: Number(o.total),
          items_count,
          customer_name: o.user.name,
          customer_phone: o.user.phone,
          address: {
            full_name: o.address.full_name,
            phone: o.address.phone,
            district: o.address.district,
            street: o.address.street,
            landmark: o.address.landmark,
            zone: o.address.zone,
          },
          label_printed_at: o.label_printed_at?.toISOString() ?? null,
          created_at: o.created_at.toISOString(),
        };
      }),
      total: orders.length,
    };
  }

  async markLabelsPrinted(dto: MarkLabelsPrintedDto, adminId: string) {
    const orders = await this.prisma.order.findMany({
      where: { id: { in: dto.order_ids } },
      select: {
        id: true,
        order_number: true,
        status: true,
        tracking_number: true,
        label_printed_at: true,
      },
    });
    const found = new Set(orders.map((o) => o.id));
    const missing = dto.order_ids.filter((id) => !found.has(id));
    if (missing.length > 0) {
      throw new NotFoundException({
        code: 'ORDERS_NOT_FOUND',
        message_en: `Orders not found: ${missing.join(', ')}`,
        message_ar: 'بعض الطلبات غير موجودة.',
      });
    }
    for (const o of orders) {
      if (
        o.status !== OrderStatus.PAYMENT_CONFIRMED &&
        o.status !== OrderStatus.PROCESSING
      ) {
        throw new ConflictException({
          code: 'ORDER_NOT_READY_FOR_LABEL',
          message_en: `Order ${o.order_number} is not in a ready-to-ship state.`,
          message_ar: 'لا يمكن طباعة بطاقة الشحن لهذا الطلب.',
        });
      }
    }

    const now = new Date();
    await this.prisma.$transaction(
      orders.map((o) => {
        const data: Prisma.OrderUpdateInput = {
          label_printed_at: now,
          tracking_number:
            o.tracking_number ?? o.order_number.replace(/^BRT-/, 'BTL-'),
        };
        if (o.status === OrderStatus.PAYMENT_CONFIRMED) {
          data.status = OrderStatus.PROCESSING;
        }
        return this.prisma.order.update({ where: { id: o.id }, data });
      }),
    );

    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.SHIPPING_LABELS,
      adminId,
      AUDIT_ACTION.LABELS_PRINTED,
      null,
      { order_ids: dto.order_ids, count: orders.length },
    );

    return { count: orders.length, printed_at: now.toISOString() };
  }

  // ───────────────────────────────────────────────────────────────────
  // Templates viewer (Slice 3b-2)
  // ───────────────────────────────────────────────────────────────────

  getTemplates() {
    // Templates use `${total}` directly — JS coerces any value via toString,
    // so passing a string placeholder through the same path produces a
    // human-readable preview without changing the template signatures.
    const placeholderCtx: OrderSmsContext = {
      orderNumber: '{{order_number}}',
      total: '{{total}}' as unknown as number,
      reason: '{{reason}}',
      customerName: '{{customer_name}}',
    };
    const render = (event: OrderSmsEvent, lang: 'AR' | 'EN'): string =>
      pickOrderSms(event, lang, placeholderCtx);

    const events: Array<{ event: OrderSmsEvent; name_en: string; name_ar: string; category: string }> = [
      { event: 'ORDER_CREATED_BANK', name_en: 'Order placed (bank transfer)', name_ar: 'إنشاء الطلب (تحويل بنكي)', category: 'order' },
      { event: 'ORDER_CREATED_COD', name_en: 'Order placed (cash on delivery)', name_ar: 'إنشاء الطلب (الدفع عند الاستلام)', category: 'order' },
      { event: 'RECEIPT_RECEIVED', name_en: 'Receipt received', name_ar: 'استلام الإيصال', category: 'payment' },
      { event: 'PAYMENT_CONFIRMED', name_en: 'Payment confirmed', name_ar: 'تأكيد الدفع', category: 'payment' },
      { event: 'PAYMENT_REJECTED', name_en: 'Payment rejected', name_ar: 'رفض الإيصال', category: 'payment' },
      { event: 'ORDER_SHIPPED', name_en: 'Order shipped', name_ar: 'تم الشحن', category: 'shipping' },
      { event: 'ORDER_DELIVERED', name_en: 'Order delivered', name_ar: 'تم التسليم', category: 'shipping' },
      { event: 'ORDER_CANCELLED', name_en: 'Order cancelled', name_ar: 'إلغاء الطلب', category: 'order' },
      { event: 'ORDER_REFUNDED', name_en: 'Order refunded', name_ar: 'استرداد المبلغ', category: 'payment' },
      { event: 'CART_ABANDONED', name_en: 'Cart abandoned', name_ar: 'سلة مهجورة', category: 'marketing' },
    ];

    return {
      templates: events.map((e) => ({
        event: e.event,
        name_en: e.name_en,
        name_ar: e.name_ar,
        category: e.category,
        ar: render(e.event, 'AR'),
        en: render(e.event, 'EN'),
        variables: extractVariables(render(e.event, 'EN')),
      })),
    };
  }

  // ───────────────────────────────────────────────────────────────────
  // Abandoned cart SMS (Slice 3b-1 carry-over)
  // ───────────────────────────────────────────────────────────────────

  async sendAbandonedCartSms(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, phone: true, language: true, is_active: true },
    });
    if (!user || !user.is_active) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message_en: 'Customer not found.',
        message_ar: 'العميل غير موجود.',
      });
    }
    // 24h rate limit via existing audit_logs (cheap lookup; no new column).
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await this.prisma.auditLog.findFirst({
      where: {
        entity_type: AUDIT_ENTITY_TYPE.ABANDONED_CART_SMS,
        entity_id: userId,
        action: AUDIT_ACTION.ABANDONED_CART_SMS_SENT,
        created_at: { gte: cutoff },
      },
    });
    if (recent) {
      throw new ConflictException({
        code: 'RATE_LIMITED',
        message_en: 'A reminder was already sent in the last 24 hours.',
        message_ar: 'تم إرسال تذكير لهذا العميل خلال آخر ٢٤ ساعة.',
      });
    }
    const customerName = (user.name ?? '').split(/\s+/)[0] ?? '';
    const ctx: OrderSmsContext = {
      orderNumber: '',
      total: 0,
      customerName,
    };
    const body = pickOrderSms('CART_ABANDONED', user.language, ctx);
    await this.notifications.sendSms(user.phone, body);
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.ABANDONED_CART_SMS,
      userId,
      AUDIT_ACTION.ABANDONED_CART_SMS_SENT,
      null,
      { phone: user.phone, language: user.language },
    );
    return { sent_to: user.phone };
  }

  // ───────────────────────────────────────────────────────────────────
  // Promos (Slice 3b-3)
  // ───────────────────────────────────────────────────────────────────

  async listPromos(query: ListPromosQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const skip = (page - 1) * limit;

    const where: Prisma.PromoWhereInput = {};
    if (query.q) {
      where.code = { contains: query.q.toUpperCase(), mode: 'insensitive' };
    }
    // Status filter is applied post-derive since `status` is computed.

    const allItems = await this.prisma.promo.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    const enriched = allItems.map((p) => ({ ...p, derived_status: derivePromoStatus(p) }));
    const filtered =
      query.status && query.status !== 'all'
        ? enriched.filter((p) => p.derived_status === query.status)
        : enriched;

    const counts = {
      active: enriched.filter((p) => p.derived_status === 'active').length,
      scheduled: enriched.filter((p) => p.derived_status === 'scheduled').length,
      expired: enriched.filter((p) => p.derived_status === 'expired').length,
      inactive: enriched.filter((p) => p.derived_status === 'inactive').length,
      all: enriched.length,
    };

    return {
      items: filtered.slice(skip, skip + limit).map((p) => ({
        id: p.id,
        code: p.code,
        description_ar: p.description_ar,
        description_en: p.description_en,
        type: p.type,
        value: Number(p.value),
        min_cart_amount: p.min_cart_amount === null ? null : Number(p.min_cart_amount),
        max_uses: p.max_uses,
        current_uses: p.current_uses,
        starts_at: p.starts_at?.toISOString() ?? null,
        expires_at: p.expires_at?.toISOString() ?? null,
        is_active: p.is_active,
        status: p.derived_status,
        created_at: p.created_at.toISOString(),
      })),
      total: filtered.length,
      page,
      limit,
      counts,
    };
  }

  async createPromo(dto: CreatePromoDto, adminId: string) {
    const code = dto.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
      throw new BadRequestException({
        code: 'INVALID_PROMO_CODE',
        message_en: 'Promo code must be 3-32 chars: A-Z, 0-9, _, -.',
        message_ar: 'رمز الخصم يجب أن يكون من ٣ إلى ٣٢ حرفاً (A-Z, 0-9, _, -).',
      });
    }
    try {
      const created = await this.prisma.promo.create({
        data: {
          code,
          description_ar: dto.description_ar,
          description_en: dto.description_en,
          type: dto.type,
          value: new Prisma.Decimal(dto.value),
          min_cart_amount: dto.min_cart_amount !== undefined
            ? new Prisma.Decimal(dto.min_cart_amount)
            : null,
          max_uses: dto.max_uses ?? null,
          starts_at: dto.starts_at ? new Date(dto.starts_at) : null,
          expires_at: dto.expires_at ? new Date(dto.expires_at) : null,
          is_active: dto.is_active ?? true,
          created_by_id: adminId,
        },
      });
      await this.writeAudit(
        adminId,
        AUDIT_ENTITY_TYPE.PROMO,
        created.id,
        AUDIT_ACTION.CREATE,
        null,
        { code, type: dto.type, value: dto.value },
      );
      return {
        id: created.id,
        code: created.code,
        type: created.type,
        value: Number(created.value),
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException({
          code: 'PROMO_CODE_EXISTS',
          message_en: `Promo code "${code}" already exists.`,
          message_ar: 'رمز الخصم موجود مسبقاً.',
        });
      }
      throw err;
    }
  }

  async updatePromo(id: string, dto: UpdatePromoDto, adminId: string) {
    const before = await this.prisma.promo.findUnique({ where: { id } });
    if (!before) {
      throw new NotFoundException({
        code: 'PROMO_NOT_FOUND',
        message_en: 'Promo not found.',
        message_ar: 'رمز الخصم غير موجود.',
      });
    }
    const data: Prisma.PromoUpdateInput = {};
    if (dto.description_ar !== undefined) data.description_ar = dto.description_ar;
    if (dto.description_en !== undefined) data.description_en = dto.description_en;
    if (dto.value !== undefined) data.value = new Prisma.Decimal(dto.value);
    if (dto.min_cart_amount !== undefined) {
      data.min_cart_amount = new Prisma.Decimal(dto.min_cart_amount);
    }
    if (dto.max_uses !== undefined) data.max_uses = dto.max_uses;
    if (dto.starts_at !== undefined) data.starts_at = new Date(dto.starts_at);
    if (dto.expires_at !== undefined) data.expires_at = new Date(dto.expires_at);
    if (dto.is_active !== undefined) data.is_active = dto.is_active;
    const after = await this.prisma.promo.update({ where: { id }, data });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.PROMO,
      id,
      AUDIT_ACTION.UPDATE,
      { value: Number(before.value), is_active: before.is_active },
      { value: Number(after.value), is_active: after.is_active },
    );
    return { id, status: derivePromoStatus(after) };
  }

  async deletePromo(id: string, adminId: string) {
    const promo = await this.prisma.promo.findUnique({ where: { id } });
    if (!promo) {
      throw new NotFoundException({
        code: 'PROMO_NOT_FOUND',
        message_en: 'Promo not found.',
        message_ar: 'رمز الخصم غير موجود.',
      });
    }
    if (!promo.is_active) {
      throw new ConflictException({
        code: 'PROMO_ALREADY_DEACTIVATED',
        message_en: 'Promo is already deactivated.',
        message_ar: 'رمز الخصم معطّل بالفعل.',
      });
    }
    await this.prisma.promo.update({ where: { id }, data: { is_active: false } });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.PROMO,
      id,
      AUDIT_ACTION.SOFT_DELETE,
      { is_active: true },
      { is_active: false },
    );
    return { id, is_active: false };
  }

  // ───────────────────────────────────────────────────────────────────
  // Banners (Slice 3b-3)
  // ───────────────────────────────────────────────────────────────────

  async listBanners(query: ListBannersQueryDto) {
    const status = query.status ?? 'all';
    const where: Prisma.BannerWhereInput =
      status === 'live' ? { status: 'LIVE' } : status === 'draft' ? { status: 'DRAFT' } : {};
    const items = await this.prisma.banner.findMany({
      where,
      orderBy: { position: 'asc' },
    });
    return {
      items: items.map((b) => ({
        id: b.id,
        title_ar: b.title_ar,
        title_en: b.title_en,
        image_url: b.image_url,
        cta_url: b.cta_url,
        position: b.position,
        status: b.status,
        click_count: b.click_count,
        created_at: b.created_at.toISOString(),
      })),
      total: items.length,
    };
  }

  async createBanner(dto: CreateBannerDto, adminId: string) {
    const max = await this.prisma.banner.aggregate({ _max: { position: true } });
    const position = (max._max.position ?? 0) + 1;
    const created = await this.prisma.banner.create({
      data: {
        title_ar: dto.title_ar,
        title_en: dto.title_en,
        image_url: dto.image_url,
        cta_url: dto.cta_url ?? null,
        status: dto.status ?? 'DRAFT',
        position,
      },
    });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.BANNER,
      created.id,
      AUDIT_ACTION.CREATE,
      null,
      { title_en: dto.title_en, position },
    );
    return { id: created.id, position };
  }

  async updateBanner(id: string, dto: UpdateBannerDto, adminId: string) {
    const before = await this.prisma.banner.findUnique({ where: { id } });
    if (!before) {
      throw new NotFoundException({
        code: 'BANNER_NOT_FOUND',
        message_en: 'Banner not found.',
        message_ar: 'البانر غير موجود.',
      });
    }
    const data: Prisma.BannerUpdateInput = {};
    if (dto.title_ar !== undefined) data.title_ar = dto.title_ar;
    if (dto.title_en !== undefined) data.title_en = dto.title_en;
    if (dto.image_url !== undefined) data.image_url = dto.image_url;
    if (dto.cta_url !== undefined) data.cta_url = dto.cta_url;
    if (dto.status !== undefined) data.status = dto.status;
    await this.prisma.banner.update({ where: { id }, data });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.BANNER,
      id,
      AUDIT_ACTION.UPDATE,
      { status: before.status, title_en: before.title_en },
      { ...dto },
    );
    return { id };
  }

  async deleteBanner(id: string, adminId: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException({
        code: 'BANNER_NOT_FOUND',
        message_en: 'Banner not found.',
        message_ar: 'البانر غير موجود.',
      });
    }
    await this.prisma.banner.delete({ where: { id } });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.BANNER,
      id,
      AUDIT_ACTION.DELETE,
      { title_en: banner.title_en, position: banner.position },
      null,
    );
    return { id, deleted: true };
  }

  async moveBanner(id: string, dto: MoveBannerDto, adminId: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException({
        code: 'BANNER_NOT_FOUND',
        message_en: 'Banner not found.',
        message_ar: 'البانر غير موجود.',
      });
    }
    const sibling = await this.prisma.banner.findFirst({
      where:
        dto.direction === 'up'
          ? { position: { lt: banner.position } }
          : { position: { gt: banner.position } },
      orderBy: { position: dto.direction === 'up' ? 'desc' : 'asc' },
    });
    if (!sibling) {
      throw new ConflictException({
        code: 'BANNER_AT_EDGE',
        message_en: `Banner is already at the ${dto.direction === 'up' ? 'top' : 'bottom'}.`,
        message_ar: 'البانر في موضع الحد بالفعل.',
      });
    }
    await this.prisma.$transaction([
      this.prisma.banner.update({
        where: { id: banner.id },
        data: { position: sibling.position },
      }),
      this.prisma.banner.update({
        where: { id: sibling.id },
        data: { position: banner.position },
      }),
    ]);
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.BANNER,
      id,
      AUDIT_ACTION.REORDER,
      { position: banner.position },
      { position: sibling.position, swapped_with: sibling.id },
    );
    return { id, new_position: sibling.position, swapped_with: sibling.id };
  }

  async uploadBannerImage(id: string, file: Express.Multer.File, adminId: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException({
        code: 'BANNER_NOT_FOUND',
        message_en: 'Banner not found.',
        message_ar: 'البانر غير موجود.',
      });
    }
    const { key, url } = await this.storage.uploadBannerImage(file);
    await this.prisma.banner.update({ where: { id }, data: { image_url: url } });
    await this.writeAudit(
      adminId,
      AUDIT_ENTITY_TYPE.BANNER,
      id,
      AUDIT_ACTION.IMAGE_UPLOAD,
      { image_url: banner.image_url },
      { image_url: url, key },
    );
    return { key, url };
  }
}

function extractVariables(body: string): string[] {
  const matches = body.matchAll(/\{\{([a-z_]+)\}\}/g);
  return Array.from(new Set(Array.from(matches, (m) => m[1])));
}

function sanitizeProductForAudit(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    name_ar: p.name_ar,
    name_en: p.name_en,
    slug: p.slug,
    sku: p.sku,
    price: Number(p.price),
    compare_price: p.compare_price === null ? null : Number(p.compare_price),
    stock: p.stock,
    is_active: p.is_active,
    is_featured: p.is_featured,
    category_id: p.category_id,
  };
}

function sanitizeZoneForAudit(z: DeliveryZoneFee): Record<string, unknown> {
  return {
    zone: z.zone,
    fee: Number(z.fee),
    free_above: z.free_above === null ? null : Number(z.free_above),
    estimated_days_min: z.estimated_days_min,
    estimated_days_max: z.estimated_days_max,
    updated_at: z.updated_at.toISOString(),
  };
}
