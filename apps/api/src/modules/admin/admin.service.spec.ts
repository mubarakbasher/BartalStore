import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DeliveryZone, OrderStatus } from '@bartal/shared';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';

function makeProduct(overrides: Partial<{ id: string; is_active: boolean; price: number }> = {}) {
  return {
    id: overrides.id ?? 'p1',
    name_ar: 'منتج',
    name_en: 'Product',
    description_ar: '...',
    description_en: '...',
    slug: 'product',
    sku: null,
    price: new Prisma.Decimal(overrides.price ?? 1500),
    compare_price: null,
    stock: 10,
    low_stock_threshold: 5,
    is_active: overrides.is_active ?? true,
    is_featured: false,
    category_id: 'c1',
    weight_grams: null,
    views_count: 0,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  };
}

function makeCategory(overrides: Partial<{ id: string; parent_id: string | null }> = {}) {
  return {
    id: overrides.id ?? 'c1',
    name_ar: 'فئة',
    name_en: 'Category',
    slug: 'cat',
    parent_id: overrides.parent_id ?? null,
    image_url: null,
    sort_order: 0,
    is_active: true,
    created_at: new Date('2026-01-01'),
  };
}

describe('AdminService', () => {
  let service: AdminService;
  let prisma: {
    order: {
      aggregate: jest.Mock;
      groupBy: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
    orderItem: { groupBy: jest.Mock };
    product: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    productImage: {
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      findFirst: jest.Mock;
      delete: jest.Mock;
    };
    category: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    user: { count: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
    deliveryZoneFee: { findUnique: jest.Mock; upsert: jest.Mock };
    appSetting: { findMany: jest.Mock; upsert: jest.Mock };
    auditLog: { create: jest.Mock; findMany: jest.Mock };
    review: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      aggregate: jest.Mock;
    };
    inventoryMovement: {
      findMany: jest.Mock;
      count: jest.Mock;
      aggregate: jest.Mock;
      create: jest.Mock;
    };
    cartSession: { findMany: jest.Mock };
    refundRequest: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    orderStatusHistory: { create: jest.Mock };
    promo: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    banner: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      aggregate: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
    $queryRaw: jest.Mock;
  };
  let orders: {
    adminUpdateStatus: jest.Mock;
    adminConfirmPayment: jest.Mock;
    adminRejectPayment: jest.Mock;
  };
  let storage: { uploadProductImage: jest.Mock };
  let notifications: { sendSms: jest.Mock };

  beforeEach(async () => {
    prisma = {
      order: {
        aggregate: jest.fn(),
        groupBy: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      orderItem: { groupBy: jest.fn() },
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      productImage: {
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: { count: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
      deliveryZoneFee: { findUnique: jest.fn(), upsert: jest.fn() },
      appSetting: { findMany: jest.fn(), upsert: jest.fn() },
      auditLog: { create: jest.fn().mockResolvedValue({}), findMany: jest.fn() },
      review: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        aggregate: jest.fn(),
      },
      inventoryMovement: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        aggregate: jest.fn().mockResolvedValue({ _sum: { quantity: 0 } }),
        create: jest.fn().mockResolvedValue({}),
      },
      cartSession: { findMany: jest.fn().mockResolvedValue([]) },
      refundRequest: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      orderStatusHistory: { create: jest.fn().mockResolvedValue({}) },
      promo: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      banner: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _max: { position: 0 } }),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      },
      $transaction: jest.fn(async (arg: unknown) => {
        if (typeof arg === 'function') {
          return (arg as (tx: unknown) => Promise<unknown>)(prisma);
        }
        return Promise.all(arg as Promise<unknown>[]);
      }),
      $queryRaw: jest.fn().mockResolvedValue([]),
    };
    orders = {
      adminUpdateStatus: jest.fn(),
      adminConfirmPayment: jest.fn(),
      adminRejectPayment: jest.fn(),
    };
    storage = { uploadProductImage: jest.fn() };
    notifications = { sendSms: jest.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prisma },
        { provide: OrdersService, useValue: orders },
        { provide: StorageService, useValue: storage },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();
    service = moduleRef.get(AdminService);
  });

  // ─── dashboard + analytics ───────────────────────────────────────

  describe('dashboard', () => {
    it('aggregates revenue + status + low stock + top products + recent orders', async () => {
      prisma.order.aggregate.mockResolvedValue({ _sum: { total: new Prisma.Decimal(5000) } });
      // first count call = orders_today, second = pending receipt-uploaded payments
      prisma.order.count.mockResolvedValueOnce(6).mockResolvedValueOnce(4);
      prisma.order.groupBy.mockResolvedValue([
        { status: 'PENDING', _count: { status: 2 } },
        { status: 'SHIPPED', _count: { status: 1 } },
      ]);
      prisma.product.count.mockResolvedValue(3);
      prisma.orderItem.groupBy.mockResolvedValue([
        { product_id: 'p1', _sum: { quantity: 7, total_price: new Prisma.Decimal(10500) } },
      ]);
      prisma.product.findMany.mockResolvedValue([makeProduct({ id: 'p1' })]);
      prisma.order.findMany.mockResolvedValue([
        {
          id: 'o1',
          order_number: 'BRT-2026-00001',
          total: new Prisma.Decimal(5000),
          status: 'PENDING',
          payment_method: 'BANK_TRANSFER',
          created_at: new Date('2026-01-01'),
          user: { name: 'Test Customer' },
        },
      ]);

      const result = await service.dashboard();
      expect(result.revenue_today).toBe(5000);
      expect(result.orders_today).toBe(6);
      expect(result.orders_by_status).toEqual([
        { status: 'PENDING', count: 2 },
        { status: 'SHIPPED', count: 1 },
      ]);
      expect(result.low_stock_count).toBe(3);
      expect(result.pending_payments).toBe(4);
      expect(result.top_products).toHaveLength(1);
      expect(result.top_products[0]).toMatchObject({
        product_id: 'p1',
        slug: 'product',
        units_sold: 7,
        revenue: 10500,
      });
      expect(result.recent_orders).toHaveLength(1);
      expect(result.recent_orders[0]).toMatchObject({
        order_number: 'BRT-2026-00001',
        customer_name: 'Test Customer',
        total: 5000,
      });
    });
  });

  describe('salesAnalytics', () => {
    it('defaults to last 30 days when no range provided', async () => {
      const result = await service.salesAnalytics();
      const span =
        new Date(result.to).getTime() - new Date(result.from).getTime();
      expect(Math.round(span / (24 * 60 * 60 * 1000))).toBe(30);
    });

    it('rejects ranges > 365 days', async () => {
      await expect(
        service.salesAnalytics('2024-01-01', '2026-05-01'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('topProducts', () => {
    it('clamps limit to [1, 50] and hydrates product names', async () => {
      prisma.orderItem.groupBy.mockResolvedValue([
        { product_id: 'p1', _sum: { quantity: 3, total_price: new Prisma.Decimal(4500) } },
      ]);
      prisma.product.findMany.mockResolvedValue([makeProduct({ id: 'p1' })]);
      await service.topProducts(9999);
      expect(prisma.orderItem.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });
  });

  // ─── orders ──────────────────────────────────────────────────────

  describe('listOrders', () => {
    it('applies status + zone + page/limit filters', async () => {
      prisma.order.count.mockResolvedValue(0);
      prisma.order.findMany.mockResolvedValue([]);
      await service.listOrders({ status: 'PENDING', zone: 'ZONE_B', page: '2', limit: '5' });
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PENDING',
            address: { zone: 'ZONE_B' },
          }),
          skip: 5,
          take: 5,
        }),
      );
    });

    it('rejects unknown status', async () => {
      await expect(service.listOrders({ status: 'UFO' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('getOrder', () => {
    it('returns reshaped order detail when present', async () => {
      prisma.order.findUnique.mockResolvedValue({
        id: 'o1',
        order_number: 'BRT-2026-00001',
        status: OrderStatus.SHIPPED,
        payment_status: 'PAID',
        payment_method: 'BANK_TRANSFER',
        subtotal: new Prisma.Decimal(1000),
        delivery_fee: new Prisma.Decimal(500),
        total: new Prisma.Decimal(1500),
        receipt_url: 'receipts/2026/05/abc.webp',
        paid_at: new Date('2026-05-21T10:00:00Z'),
        shipped_at: new Date('2026-05-21T12:00:00Z'),
        delivered_at: null,
        cancelled_at: null,
        cancellation_reason: null,
        notes: null,
        internal_notes: null,
        created_at: new Date('2026-05-21T09:00:00Z'),
        items: [
          {
            id: 'i1',
            product_id: 'p1',
            unit_price: new Prisma.Decimal(500),
            quantity: 2,
            product: {
              id: 'p1',
              name_ar: 'كركديه',
              name_en: 'Karkadeh',
              slug: 'karkadeh',
              images: [{ url: 'https://example.com/img.webp' }],
            },
          },
        ],
        user: { id: 'u1', name: 'Test', phone: '+249977000000', email: null },
        address: {
          full_name: 'Test User',
          phone: '+249977000000',
          district: 'Al-Riyadh',
          landmark: 'Next to mosque',
          zone: 'ZONE_B',
        },
        status_history: [
          {
            id: 'h1',
            status: OrderStatus.SHIPPED,
            note: 'on the way',
            created_at: new Date('2026-05-21T12:00:00Z'),
            changed_by_id: 'admin1',
          },
        ],
      });
      const result = await service.getOrder('o1');
      expect(result.id).toBe('o1');
      expect(result.total).toBe(1500);
      expect(result.items[0].line_total).toBe(1000);
      expect(result.items[0].image_url).toBe('https://example.com/img.webp');
      expect(result.history[0].changed_by_id).toBe('admin1');
      expect(result.address.landmark).toBe('Next to mosque');
    });

    it('throws ORDER_NOT_FOUND when missing', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.getOrder('nope')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'ORDER_NOT_FOUND' }),
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('delegates to OrdersService.adminUpdateStatus and writes audit', async () => {
      prisma.order.findUnique.mockResolvedValue({ status: OrderStatus.PROCESSING });
      orders.adminUpdateStatus.mockResolvedValue({
        id: 'o1',
        status: OrderStatus.SHIPPED,
        payment_status: 'PAID',
      });
      await service.updateOrderStatus('o1', { status: OrderStatus.SHIPPED, note: 'on the way' }, 'admin1');
      expect(orders.adminUpdateStatus).toHaveBeenCalledWith(
        'admin1',
        'o1',
        OrderStatus.SHIPPED,
        'on the way',
      );
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          actor_id: 'admin1',
          entity_type: 'Order',
          entity_id: 'o1',
          action: 'STATUS_CHANGE',
        }),
      });
    });
  });

  describe('updateOrderPayment', () => {
    it('PAID → confirms via OrdersService + writes PAYMENT_CONFIRMED audit', async () => {
      orders.adminConfirmPayment.mockResolvedValue({
        id: 'o1',
        status: OrderStatus.PAYMENT_CONFIRMED,
        payment_status: 'PAID',
      });
      await service.updateOrderPayment('o1', { status: 'PAID' as const }, 'admin1');
      expect(orders.adminConfirmPayment).toHaveBeenCalledWith('admin1', 'o1');
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'PAYMENT_CONFIRMED' }),
      });
    });

    it('REFUNDED w/o reason → REJECTION_REASON_REQUIRED', async () => {
      await expect(
        service.updateOrderPayment('o1', { status: 'REFUNDED' as const }, 'admin1'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(orders.adminRejectPayment).not.toHaveBeenCalled();
    });

    it('REFUNDED w/ reason → rejects via OrdersService + writes PAYMENT_REJECTED audit', async () => {
      orders.adminRejectPayment.mockResolvedValue({
        id: 'o1',
        status: OrderStatus.PAYMENT_REJECTED,
        payment_status: 'UNPAID',
      });
      await service.updateOrderPayment(
        'o1',
        { status: 'REFUNDED' as const, reason: 'wrong amount' },
        'admin1',
      );
      expect(orders.adminRejectPayment).toHaveBeenCalledWith('admin1', 'o1', 'wrong amount');
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'PAYMENT_REJECTED' }),
      });
    });
  });

  // ─── catalog reads (admin) ──────────────────────────────────────

  describe('getProducts', () => {
    it('filters by status=out_of_stock + paginates + returns counts payload', async () => {
      prisma.$transaction.mockImplementationOnce(async (calls: unknown) =>
        Array.isArray(calls)
          ? [
              1,
              [
                {
                  ...makeProduct({ id: 'p1' }),
                  category: { id: 'c1', slug: 'cat', name_ar: 'فئة', name_en: 'Cat' },
                  images: [{ id: 'i1', url: 'https://cdn/p1.webp' }],
                },
              ],
              100,
              80,
              20,
              5,
              12,
            ]
          : Promise.resolve([]),
      );
      const result = await service.getProducts({
        status: 'out_of_stock',
        page: '1',
        limit: '25',
      });
      expect(result.items[0].primary_image_url).toBe('https://cdn/p1.webp');
      expect(result.counts).toEqual({
        all: 100,
        active: 80,
        inactive: 20,
        out_of_stock: 5,
        featured: 12,
      });
    });
  });

  describe('getProduct', () => {
    it('returns reshaped product with images sorted', async () => {
      prisma.product.findUnique.mockResolvedValue({
        ...makeProduct({ id: 'p1' }),
        category: { id: 'c1', slug: 'cat', name_ar: 'فئة', name_en: 'Cat' },
        images: [
          { id: 'i2', url: 'https://cdn/2', alt_ar: null, alt_en: null, sort_order: 1, is_primary: true },
        ],
      });
      const result = await service.getProduct('p1');
      expect(result.id).toBe('p1');
      expect(result.images).toHaveLength(1);
      expect(result.price).toBe(1500);
    });

    it('throws PRODUCT_NOT_FOUND when missing', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.getProduct('nope')).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'PRODUCT_NOT_FOUND' }),
      });
    });
  });

  describe('getCategories', () => {
    it('returns rows with product_count', async () => {
      prisma.category.findMany.mockResolvedValue([
        { ...makeCategory({ id: 'c1' }), _count: { products: 7 } },
        { ...makeCategory({ id: 'c2', parent_id: 'c1' }), _count: { products: 0 } },
      ]);
      const result = await service.getCategories();
      expect(result).toHaveLength(2);
      expect(result[0].product_count).toBe(7);
      expect(result[1].parent_id).toBe('c1');
    });
  });

  describe('updateProductImage', () => {
    it('flips is_primary on other images when set to true', async () => {
      prisma.productImage.findFirst.mockResolvedValue({
        id: 'i1',
        product_id: 'p1',
        url: 'https://cdn/i1',
        alt_ar: null,
        alt_en: null,
        sort_order: 0,
        is_primary: false,
      });
      prisma.productImage.updateMany.mockResolvedValue({ count: 1 });
      prisma.productImage.update.mockResolvedValue({
        id: 'i1',
        product_id: 'p1',
        url: 'https://cdn/i1',
        alt_ar: null,
        alt_en: null,
        sort_order: 0,
        is_primary: true,
      });
      const result = await service.updateProductImage('p1', 'i1', { is_primary: true }, 'admin1');
      expect(prisma.productImage.updateMany).toHaveBeenCalledWith({
        where: { product_id: 'p1', is_primary: true, id: { not: 'i1' } },
        data: { is_primary: false },
      });
      expect(result.is_primary).toBe(true);
    });

    it('throws IMAGE_NOT_FOUND when image does not belong to product', async () => {
      prisma.productImage.findFirst.mockResolvedValue(null);
      await expect(
        service.updateProductImage('p1', 'wrong', { sort_order: 1 }, 'admin1'),
      ).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'IMAGE_NOT_FOUND' }),
      });
    });
  });

  describe('deleteProductImage', () => {
    it('auto-promotes next image to primary when deleting the primary one', async () => {
      prisma.productImage.findFirst
        .mockResolvedValueOnce({
          id: 'i1',
          product_id: 'p1',
          url: 'https://cdn/i1',
          alt_ar: null,
          alt_en: null,
          sort_order: 0,
          is_primary: true,
        })
        .mockResolvedValueOnce({
          id: 'i2',
          product_id: 'p1',
          url: 'https://cdn/i2',
          alt_ar: null,
          alt_en: null,
          sort_order: 1,
          is_primary: false,
        });
      prisma.productImage.delete.mockResolvedValue({});
      prisma.productImage.update.mockResolvedValue({});
      await service.deleteProductImage('p1', 'i1', 'admin1');
      expect(prisma.productImage.delete).toHaveBeenCalledWith({ where: { id: 'i1' } });
      expect(prisma.productImage.update).toHaveBeenCalledWith({
        where: { id: 'i2' },
        data: { is_primary: true },
      });
    });

    it('does not promote anything when deleted image was not primary', async () => {
      prisma.productImage.findFirst.mockResolvedValueOnce({
        id: 'i2',
        product_id: 'p1',
        url: 'https://cdn/i2',
        alt_ar: null,
        alt_en: null,
        sort_order: 1,
        is_primary: false,
      });
      prisma.productImage.delete.mockResolvedValue({});
      await service.deleteProductImage('p1', 'i2', 'admin1');
      expect(prisma.productImage.update).not.toHaveBeenCalled();
    });
  });

  // ─── products ────────────────────────────────────────────────────

  describe('createProduct', () => {
    const dto = {
      name_ar: 'منتج',
      name_en: 'Product',
      description_ar: '...',
      description_en: '...',
      slug: 'product',
      price: 1500,
      stock: 10,
      category_id: 'c1',
    };

    it('verifies category exists + writes audit on success', async () => {
      prisma.category.findUnique.mockResolvedValue(makeCategory());
      prisma.product.create.mockResolvedValue(makeProduct());
      await service.createProduct(dto, 'admin1');
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ action: 'CREATE', entity_type: 'Product' }),
      });
    });

    it('throws CATEGORY_NOT_FOUND when category missing', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.createProduct(dto, 'admin1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('P2002 slug → 409 SLUG_EXISTS', async () => {
      prisma.category.findUnique.mockResolvedValue(makeCategory());
      prisma.product.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', {
          code: 'P2002',
          clientVersion: 'x',
          meta: { target: ['slug'] },
        }),
      );
      await expect(service.createProduct(dto, 'admin1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('updateProduct', () => {
    it('writes before/after audit on success', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.product.update.mockResolvedValue(makeProduct({ price: 2000 }));
      await service.updateProduct('p1', { price: 2000 }, 'admin1');
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'UPDATE',
          before: expect.objectContaining({ price: 1500 }),
          after: expect.objectContaining({ price: 2000 }),
        }),
      });
    });
  });

  describe('deleteProduct', () => {
    it('flips is_active and writes SOFT_DELETE audit', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.product.update.mockResolvedValue(makeProduct({ is_active: false }));
      const result = await service.deleteProduct('p1', 'admin1');
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { is_active: false },
      });
      expect(result.is_active).toBe(false);
    });

    it('rejects already-deleted product with 409', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct({ is_active: false }));
      await expect(service.deleteProduct('p1', 'admin1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('uploadProductImages', () => {
    it('uploads via storage + creates row + flips primary when requested', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      storage.uploadProductImage.mockResolvedValue({
        key: 'products/abc.webp',
        url: 'https://cdn/products/abc.webp',
      });
      prisma.productImage.updateMany.mockResolvedValue({ count: 1 });
      prisma.productImage.create.mockResolvedValue({
        id: 'img1',
        product_id: 'p1',
        url: 'https://cdn/products/abc.webp',
        is_primary: true,
        sort_order: 0,
      });

      const file = { buffer: Buffer.from('x'), mimetype: 'image/png' } as unknown as Express.Multer.File;
      const result = await service.uploadProductImages(
        'p1',
        file,
        { is_primary: true },
        'admin1',
      );
      expect(storage.uploadProductImage).toHaveBeenCalledWith(file);
      expect(prisma.productImage.updateMany).toHaveBeenCalledWith({
        where: { product_id: 'p1', is_primary: true },
        data: { is_primary: false },
      });
      expect(result.is_primary).toBe(true);
    });
  });

  // ─── categories ──────────────────────────────────────────────────

  describe('createCategory', () => {
    it('rejects unknown parent_id with CATEGORY_NOT_FOUND', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(
        service.createCategory({
          name_ar: 'x', name_en: 'x', slug: 'x', parent_id: 'missing',
        }, 'admin1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateCategory', () => {
    it('rejects self-as-parent cycle', async () => {
      prisma.category.findUnique.mockResolvedValue(makeCategory());
      await expect(
        service.updateCategory('c1', { parent_id: 'c1' }, 'admin1'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  // ─── customers ───────────────────────────────────────────────────

  describe('listCustomers', () => {
    it('filters by q and computes last_order_at via groupBy', async () => {
      prisma.user.count.mockResolvedValue(1);
      prisma.user.findMany.mockResolvedValue([
        {
          id: 'u1',
          name: 'Mo',
          phone: '+249912345678',
          email: null,
          language: 'AR',
          is_active: true,
          created_at: new Date('2026-01-01'),
          _count: { orders: 2 },
        },
      ]);
      prisma.order.groupBy.mockResolvedValue([
        { user_id: 'u1', _max: { created_at: new Date('2026-05-01') } },
      ]);

      const result = await service.listCustomers(1, 20, '+249912');
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: 'CUSTOMER' }),
        }),
      );
      expect(result.items[0].order_count).toBe(2);
      expect(result.items[0].last_order_at).not.toBeNull();
    });
  });

  describe('customerDetail', () => {
    it('throws CUSTOMER_NOT_FOUND when missing or not a customer', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.customerDetail('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  // ─── delivery zone ───────────────────────────────────────────────

  describe('updateZoneFee', () => {
    it('rejects min > max ETAs', async () => {
      await expect(
        service.updateZoneFee(
          'ZONE_B' as DeliveryZone,
          { fee: 1000, estimated_days_min: 5, estimated_days_max: 1 },
          'admin1',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('upserts + writes audit on success', async () => {
      prisma.deliveryZoneFee.findUnique.mockResolvedValue(null);
      prisma.deliveryZoneFee.upsert.mockResolvedValue({
        zone: 'ZONE_B' as DeliveryZone,
        fee: new Prisma.Decimal(1500),
        free_above: null,
        estimated_days_min: 1,
        estimated_days_max: 2,
        updated_at: new Date(),
      });
      await service.updateZoneFee(
        'ZONE_B' as DeliveryZone,
        { fee: 1500, estimated_days_min: 1, estimated_days_max: 2 },
        'admin1',
      );
      expect(prisma.deliveryZoneFee.upsert).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          entity_type: 'DeliveryZoneFee',
          entity_id: 'ZONE_B',
          action: 'ZONE_FEE_UPDATE',
        }),
      });
    });
  });

  // ─── settings ────────────────────────────────────────────────────

  describe('updateSettings', () => {
    it('batches upserts + writes single SETTINGS_UPDATE audit', async () => {
      prisma.appSetting.findMany.mockResolvedValue([
        { key: 'store.name_ar', value: 'old' },
      ]);
      prisma.appSetting.upsert.mockResolvedValue({});

      await service.updateSettings(
        { settings: { 'store.name_ar': 'new', 'ui.banner_ar': 'hello' } },
        'admin1',
      );
      expect(prisma.appSetting.upsert).toHaveBeenCalledTimes(2);
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'SETTINGS_UPDATE',
          entity_type: 'AppSetting',
          entity_id: '*',
        }),
      });
    });

    it('rejects invalid setting keys', async () => {
      await expect(
        service.updateSettings({ settings: { 'Invalid_Key': 'x' } }, 'admin1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects empty settings', async () => {
      await expect(
        service.updateSettings({ settings: {} }, 'admin1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  // ─── reviews moderation ─────────────────────────────────────────────

  describe('listReviews', () => {
    it('default status=pending filters PENDING + flagged_reason null', async () => {
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      await service.listReviews({});
      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { moderation_status: 'PENDING', flagged_reason: null },
        }),
      );
    });

    it('status=flagged filters PENDING + flagged_reason not null', async () => {
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      await service.listReviews({ status: 'flagged' });
      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { moderation_status: 'PENDING', flagged_reason: { not: null } },
        }),
      );
    });

    it('status=approved + rejected map straight to moderation_status', async () => {
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      await service.listReviews({ status: 'approved' });
      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { moderation_status: 'APPROVED' } }),
      );
      await service.listReviews({ status: 'rejected' });
      expect(prisma.review.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({ where: { moderation_status: 'REJECTED' } }),
      );
    });

    it('status=all does not constrain moderation_status', async () => {
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      await service.listReviews({ status: 'all' });
      const arg = prisma.review.findMany.mock.calls[0][0];
      expect(arg.where.moderation_status).toBeUndefined();
    });
  });

  describe('approveReview', () => {
    it('updates status, sets moderator, clears rejection_reason, writes audit', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'r1',
        moderation_status: 'PENDING',
        flagged_reason: null,
        rejection_reason: null,
        moderated_by: null,
        moderated_at: null,
      });
      prisma.review.update.mockResolvedValue({
        id: 'r1',
        moderation_status: 'APPROVED',
        flagged_reason: null,
        rejection_reason: null,
        moderated_by: 'admin1',
        moderated_at: new Date(),
      });
      const result = await service.approveReview('r1', 'admin1');
      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'r1' },
          data: expect.objectContaining({
            moderation_status: 'APPROVED',
            moderated_by: 'admin1',
            rejection_reason: null,
          }),
        }),
      );
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            actor_id: 'admin1',
            entity_type: 'Review',
            entity_id: 'r1',
            action: 'REVIEW_APPROVED',
          }),
        }),
      );
      expect(result.moderation_status).toBe('APPROVED');
    });

    it('throws REVIEW_NOT_FOUND if review missing', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      await expect(service.approveReview('nope', 'admin1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.review.update).not.toHaveBeenCalled();
    });
  });

  describe('rejectReview', () => {
    beforeEach(() => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'r1',
        moderation_status: 'PENDING',
        flagged_reason: 'Auto-flag: contains "defective"',
        rejection_reason: null,
        moderated_by: null,
        moderated_at: null,
      });
      prisma.review.update.mockResolvedValue({
        id: 'r1',
        moderation_status: 'REJECTED',
        flagged_reason: 'Auto-flag: contains "defective"',
        rejection_reason: 'Promotional / spam',
        moderated_by: 'admin1',
        moderated_at: new Date(),
      });
    });

    it('stores rejection_reason + writes REVIEW_REJECTED audit', async () => {
      const result = await service.rejectReview('r1', { reason: 'Promotional / spam' }, 'admin1');
      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            moderation_status: 'REJECTED',
            rejection_reason: 'Promotional / spam',
          }),
        }),
      );
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'REVIEW_REJECTED',
          }),
        }),
      );
      expect(result.rejection_reason).toBe('Promotional / spam');
    });

    it('throws REVIEW_NOT_FOUND if review missing', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      await expect(
        service.rejectReview('nope', { reason: 'spam' }, 'admin1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('resetReviewToPending', () => {
    it('clears moderator fields + rejection_reason + writes audit', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'r1',
        moderation_status: 'REJECTED',
        flagged_reason: null,
        rejection_reason: 'low quality',
        moderated_by: 'admin1',
        moderated_at: new Date(),
      });
      prisma.review.update.mockResolvedValue({
        id: 'r1',
        moderation_status: 'PENDING',
        flagged_reason: null,
        rejection_reason: null,
        moderated_by: null,
        moderated_at: null,
      });
      const result = await service.resetReviewToPending('r1', 'admin1');
      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            moderation_status: 'PENDING',
            moderated_by: null,
            moderated_at: null,
            rejection_reason: null,
          }),
        }),
      );
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'REVIEW_RESET_TO_PENDING' }),
        }),
      );
      expect(result.moderation_status).toBe('PENDING');
    });
  });

  describe('listStaff', () => {
    it('returns active admin users; sorted last-login-desc', async () => {
      prisma.user.findMany.mockResolvedValue([
        {
          id: 'a1',
          name: 'Sara Mahmoud',
          phone: '+249911111111',
          email: 'sara@bartal.sd',
          role: 'ADMIN',
          last_login_at: new Date('2026-05-22T10:00:00Z'),
          created_at: new Date('2026-01-01'),
        },
      ]);
      const result = await service.listStaff();
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'ADMIN', is_active: true },
        }),
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({ id: 'a1', name: 'Sara Mahmoud' });
    });
  });

  describe('listAuditFeed', () => {
    it('applies entity_type filter + clamps limit', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      await service.listAuditFeed({ entity_type: 'Review', limit: 9999 });
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { entity_type: 'Review' },
          take: 100,
        }),
      );
    });

    it('default limit is 50', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      await service.listAuditFeed({});
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });
  });

  // ─── Slice 3b-1: inventory movements ─────────────────────────────────

  describe('getInventoryMovements', () => {
    it('filters by type + product_id, paginates, returns KPIs', async () => {
      prisma.inventoryMovement.findMany.mockResolvedValue([
        {
          id: 'm1',
          product_id: 'p1',
          sku: 'SKU-1',
          type: 'SALE',
          quantity: -2,
          stock_after: 48,
          reference: 'BRT-2026-00042',
          actor_id: null,
          created_at: new Date('2026-05-23T12:00:00Z'),
          product: { id: 'p1', name_ar: 'منتج', name_en: 'Product', sku: 'SKU-1' },
          actor: null,
        },
      ]);
      prisma.inventoryMovement.count.mockResolvedValue(1);
      prisma.inventoryMovement.aggregate.mockResolvedValue({ _sum: { quantity: -2 } });
      prisma.$queryRaw.mockResolvedValueOnce([{ c: BigInt(3) }]);

      const result = await service.getInventoryMovements({
        type: 'SALE',
        product_id: 'p1',
        page: 1,
        limit: 20,
      });

      expect(prisma.inventoryMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'SALE', product_id: 'p1' }),
          skip: 0,
          take: 20,
        }),
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('SALE');
      expect(result.kpis.low_stock_count).toBe(3);
      expect(result.kpis.net_change_today).toBe(-2);
      expect(result.kpis.pending_pos).toBe(0);
    });

    it('clamps limit to 100', async () => {
      prisma.inventoryMovement.findMany.mockResolvedValue([]);
      await service.getInventoryMovements({ limit: 9999 });
      expect(prisma.inventoryMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 }),
      );
    });

    it('rejects invalid from date', async () => {
      await expect(
        service.getInventoryMovements({ from: 'garbage' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  // ─── Slice 3b-1: abandoned carts ─────────────────────────────────────

  describe('getAbandonedCarts', () => {
    it('returns enriched carts with stage + recovery score + summary', async () => {
      prisma.cartSession.findMany.mockResolvedValue([
        {
          user_id: 'u1',
          items: [{ product_id: 'p1', quantity: 5 }],
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          user: {
            id: 'u1',
            name: 'Mohammed',
            phone: '+249911234567',
            addresses: [{ id: 'a1', is_default: true }],
          },
        },
        {
          user_id: 'u2',
          items: [{ product_id: 'p1', quantity: 1 }],
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
          user: {
            id: 'u2',
            name: 'Sara',
            phone: '+249922222222',
            addresses: [],
          },
        },
      ]);
      prisma.product.findMany.mockResolvedValue([
        { id: 'p1', name_ar: 'م', name_en: 'P', price: new Prisma.Decimal(50_000) },
      ]);

      const result = await service.getAbandonedCarts({ min_age_hours: 1 });
      expect(result.items).toHaveLength(2);
      const mo = result.items.find((c) => c.user_id === 'u1');
      const sa = result.items.find((c) => c.user_id === 'u2');
      expect(mo?.stage).toBe('address');
      expect(mo?.recovery_score).toBe('hot');
      expect(sa?.stage).toBe('cart');
      expect(result.summary.active_carts).toBe(2);
      expect(result.summary.items_in_carts).toBe(6);
    });

    it('filters by stage', async () => {
      prisma.cartSession.findMany.mockResolvedValue([
        {
          user_id: 'u1',
          items: [{ product_id: 'p1', quantity: 1 }],
          updated_at: new Date(Date.now() - 60 * 60 * 1000),
          user: { id: 'u1', name: 'X', phone: '+249', addresses: [] },
        },
      ]);
      prisma.product.findMany.mockResolvedValue([
        { id: 'p1', name_ar: '', name_en: '', price: new Prisma.Decimal(1000) },
      ]);
      const result = await service.getAbandonedCarts({ stage: 'address' });
      expect(result.items).toHaveLength(0);
    });
  });

  // ─── Slice 3b-1: sales analytics breakdown ───────────────────────────

  describe('salesAnalytics with breakdown=zone', () => {
    it('returns rows grouped by date + zone', async () => {
      prisma.$queryRaw.mockResolvedValueOnce([
        {
          date: new Date('2026-05-22'),
          zone: 'ZONE_A',
          revenue: '5000',
          order_count: BigInt(3),
        },
        {
          date: new Date('2026-05-22'),
          zone: 'ZONE_B',
          revenue: '8000',
          order_count: BigInt(2),
        },
      ]);
      const result = await service.salesAnalytics(
        '2026-05-20',
        '2026-05-23',
        'zone',
      );
      expect(result.breakdown).toBe('zone');
      expect(result.days).toHaveLength(2);
      expect(result.days[0]).toMatchObject({ zone: 'ZONE_A', revenue: 5000 });
    });
  });

  // ─── Slice 3b-2: refunds ─────────────────────────────────────────

  function makeOrderForRefund(overrides: Partial<{ id: string; status: string; payment_status: string }> = {}) {
    return {
      id: overrides.id ?? 'o1',
      order_number: 'BRT-2026-00001',
      user_id: 'u1',
      status: overrides.status ?? 'DELIVERED',
      payment_status: overrides.payment_status ?? 'PAID',
      total: new Prisma.Decimal(50000),
    } as unknown as Record<string, unknown>;
  }

  describe('listRefunds', () => {
    it('filters by status + returns counts payload', async () => {
      prisma.refundRequest.findMany.mockResolvedValue([
        {
          id: 'r1',
          refund_number: 'RFD-2026-00001',
          order_id: 'o1',
          amount: new Prisma.Decimal(50000),
          reason: 'damaged',
          status: 'PENDING',
          rejection_reason: null,
          decided_at: null,
          created_at: new Date(),
          order: { id: 'o1', order_number: 'BRT-2026-00001', total: new Prisma.Decimal(50000), user: { id: 'u1', name: 'X', phone: '+249' } },
          requested_by: { id: 'admin1', name: 'Admin' },
          decided_by: null,
        },
      ]);
      prisma.refundRequest.count.mockResolvedValueOnce(1).mockResolvedValueOnce(1).mockResolvedValueOnce(0).mockResolvedValueOnce(0);
      const result = await service.listRefunds({ status: 'pending' });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].refund_number).toBe('RFD-2026-00001');
      expect(result.counts).toEqual({ pending: 1, approved: 0, rejected: 0, all: 1 });
    });
  });

  describe('createRefund', () => {
    it('rejects ORDER_NOT_REFUNDABLE when payment_status is not PAID', async () => {
      prisma.order.findUnique.mockResolvedValue(
        makeOrderForRefund({ payment_status: 'UNPAID' }),
      );
      await expect(
        service.createRefund({ order_id: 'o1', amount: 50000, reason: 'whatever' }, 'admin1'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects REFUND_ALREADY_EXISTS when a PENDING refund exists', async () => {
      prisma.order.findUnique.mockResolvedValue(makeOrderForRefund());
      prisma.refundRequest.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(
        service.createRefund({ order_id: 'o1', amount: 50000, reason: 'whatever' }, 'admin1'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates a refund + writes audit + returns the refund_number', async () => {
      prisma.order.findUnique.mockResolvedValue(makeOrderForRefund());
      prisma.refundRequest.findFirst.mockResolvedValue(null);
      prisma.refundRequest.create.mockResolvedValue({
        id: 'r1',
        refund_number: 'RFD-2026-00001',
        status: 'PENDING',
        amount: new Prisma.Decimal(50000),
      });
      const result = await service.createRefund(
        { order_id: 'o1', amount: 50000, reason: 'damaged' },
        'admin1',
      );
      expect(prisma.refundRequest.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(result.refund_number).toBe('RFD-2026-00001');
    });
  });

  describe('approveRefund', () => {
    it('transactionally flips refund + order + writes history + audit + fires SMS', async () => {
      prisma.refundRequest.findUnique.mockResolvedValue({
        id: 'r1',
        refund_number: 'RFD-2026-00001',
        status: 'PENDING',
        order_id: 'o1',
        amount: new Prisma.Decimal(50000),
        order: { id: 'o1', order_number: 'BRT-2026-00001', user_id: 'u1', status: 'DELIVERED' },
      });
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', phone: '+249', language: 'AR' });
      // user.findUnique used for post-commit SMS
      (prisma as unknown as { user: { findUnique: jest.Mock } }).user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'u1', phone: '+249', language: 'AR' });
      const result = await service.approveRefund('r1', 'admin1');
      expect(result.status).toBe('APPROVED');
      expect(prisma.refundRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'r1' }, data: expect.objectContaining({ status: 'APPROVED' }) }),
      );
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'o1' },
          data: expect.objectContaining({ status: 'REFUNDED', payment_status: 'REFUNDED' }),
        }),
      );
      expect(prisma.orderStatusHistory.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(notifications.sendSms).toHaveBeenCalledWith('+249', expect.stringContaining('BRT-2026-00001'));
    });

    it('rejects when refund is not PENDING', async () => {
      prisma.refundRequest.findUnique.mockResolvedValue({
        id: 'r1',
        status: 'APPROVED',
        order: { status: 'REFUNDED' },
      });
      await expect(service.approveRefund('r1', 'admin1')).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('rejectRefund', () => {
    it('flips refund to REJECTED + writes audit; no order side-effect', async () => {
      prisma.refundRequest.findUnique.mockResolvedValue({ id: 'r1', status: 'PENDING' });
      const result = await service.rejectRefund('r1', { reason: 'duplicate' }, 'admin1');
      expect(result.status).toBe('REJECTED');
      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.refundRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'r1' },
          data: expect.objectContaining({ status: 'REJECTED', rejection_reason: 'duplicate' }),
        }),
      );
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });

  // ─── Slice 3b-2: shipping labels ───────────────────────────────────

  describe('markLabelsPrinted', () => {
    it('advances PAYMENT_CONFIRMED → PROCESSING + derives BTL-… tracking number', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: 'o1', order_number: 'BRT-2026-00001', status: 'PAYMENT_CONFIRMED', tracking_number: null, label_printed_at: null },
      ]);
      prisma.order.update.mockResolvedValue({});
      const result = await service.markLabelsPrinted({ order_ids: ['o1'] }, 'admin1');
      expect(result.count).toBe(1);
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'o1' },
          data: expect.objectContaining({
            status: 'PROCESSING',
            tracking_number: 'BTL-2026-00001',
          }),
        }),
      );
    });

    it('leaves PROCESSING status alone but still sets label_printed_at', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: 'o1', order_number: 'BRT-2026-00099', status: 'PROCESSING', tracking_number: null, label_printed_at: null },
      ]);
      prisma.order.update.mockResolvedValue({});
      await service.markLabelsPrinted({ order_ids: ['o1'] }, 'admin1');
      const call = (prisma.order.update.mock.calls[0]?.[0] ?? {}) as { data?: Record<string, unknown> };
      expect(call.data?.status).toBeUndefined();
      expect(call.data?.label_printed_at).toBeInstanceOf(Date);
      expect(call.data?.tracking_number).toBe('BTL-2026-00099');
    });

    it('rejects the whole batch on unknown id', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: 'o1', order_number: 'BRT-2026-00001', status: 'PAYMENT_CONFIRMED', tracking_number: null, label_printed_at: null },
      ]);
      await expect(
        service.markLabelsPrinted({ order_ids: ['o1', 'missing'] }, 'admin1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ─── Slice 3b-2: templates viewer ───────────────────────────────────

  describe('getTemplates', () => {
    it('returns 10 templates with placeholders + extracted variable list', () => {
      const result = service.getTemplates();
      expect(result.templates.length).toBe(10);
      const refunded = result.templates.find((t) => t.event === 'ORDER_REFUNDED');
      expect(refunded).toBeDefined();
      expect(refunded!.en).toContain('{{order_number}}');
      expect(refunded!.en).toContain('{{total}}');
      expect(refunded!.variables).toEqual(expect.arrayContaining(['order_number', 'total']));
    });
  });

  // ─── Slice 3b-1 carry-over: abandoned-cart SMS ─────────────────────

  describe('sendAbandonedCartSms', () => {
    it('sends SMS + writes audit when no prior send in 24h', async () => {
      (prisma as unknown as { user: { findUnique: jest.Mock } }).user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'u1', name: 'Mohammed Osman', phone: '+249', language: 'AR', is_active: true });
      prisma.auditLog.findMany = jest.fn();
      (prisma as unknown as { auditLog: { findFirst: jest.Mock } }).auditLog.findFirst = jest
        .fn()
        .mockResolvedValue(null);
      const result = await service.sendAbandonedCartSms('u1', 'admin1');
      expect(notifications.sendSms).toHaveBeenCalledWith('+249', expect.any(String));
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(result.sent_to).toBe('+249');
    });

    it('rejects 429 when an SMS was sent in the last 24h', async () => {
      (prisma as unknown as { user: { findUnique: jest.Mock } }).user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'u1', name: 'X', phone: '+249', language: 'AR', is_active: true });
      (prisma as unknown as { auditLog: { findFirst: jest.Mock } }).auditLog.findFirst = jest
        .fn()
        .mockResolvedValue({ id: 'audit1' });
      await expect(service.sendAbandonedCartSms('u1', 'admin1')).rejects.toBeInstanceOf(ConflictException);
    });
  });

  // ─── Slice 3b-3: promos ─────────────────────────────────────────────

  function makePromo(overrides: Partial<{ id: string; code: string; is_active: boolean; value: number; expires_at: Date | null }> = {}) {
    return {
      id: overrides.id ?? 'pr1',
      code: overrides.code ?? 'TEST10',
      description_ar: 'خصم',
      description_en: 'discount',
      type: 'PERCENTAGE',
      value: new Prisma.Decimal(overrides.value ?? 10),
      min_cart_amount: null,
      max_uses: null,
      current_uses: 0,
      starts_at: null,
      expires_at: overrides.expires_at ?? null,
      is_active: overrides.is_active ?? true,
      created_by_id: 'admin1',
      created_at: new Date('2026-06-01'),
      updated_at: new Date('2026-06-01'),
    };
  }

  describe('listPromos', () => {
    it('filters by derived status + returns counts payload', async () => {
      prisma.promo.findMany.mockResolvedValue([
        makePromo({ id: 'p1', code: 'ACTIVE' }),
        makePromo({ id: 'p2', code: 'EXPIRED', expires_at: new Date('2024-01-01') }),
        makePromo({ id: 'p3', code: 'INACTIVE', is_active: false }),
      ]);
      prisma.promo.count.mockResolvedValue(3);
      const result = await service.listPromos({ status: 'active' });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].code).toBe('ACTIVE');
      expect(result.counts).toEqual({
        active: 1,
        scheduled: 0,
        expired: 1,
        inactive: 1,
        all: 3,
      });
    });
  });

  describe('createPromo', () => {
    it('rejects invalid code format', async () => {
      await expect(
        service.createPromo(
          { code: 'ab', description_ar: 'x', description_en: 'x', type: 'PERCENTAGE', value: 10 },
          'admin1',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('uppercases + creates promo + writes audit', async () => {
      prisma.promo.create.mockResolvedValue({
        id: 'p1',
        code: 'RAMADAN15',
        type: 'PERCENTAGE',
        value: new Prisma.Decimal(15),
      });
      const result = await service.createPromo(
        {
          code: 'ramadan15',
          description_ar: 'خصم',
          description_en: 'discount',
          type: 'PERCENTAGE',
          value: 15,
        },
        'admin1',
      );
      expect(result.code).toBe('RAMADAN15');
      expect(prisma.promo.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ code: 'RAMADAN15' }) }),
      );
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('rethrows P2002 as PROMO_CODE_EXISTS', async () => {
      prisma.promo.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: 'x', meta: {} }),
      );
      await expect(
        service.createPromo(
          { code: 'DUPE10', description_ar: 'x', description_en: 'x', type: 'PERCENTAGE', value: 10 },
          'admin1',
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('deletePromo', () => {
    it('flips is_active=false + audit SOFT_DELETE', async () => {
      prisma.promo.findUnique.mockResolvedValue(makePromo({ is_active: true }));
      const result = await service.deletePromo('p1', 'admin1');
      expect(result.is_active).toBe(false);
      expect(prisma.promo.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'p1' }, data: { is_active: false } }),
      );
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('rejects PROMO_ALREADY_DEACTIVATED on second call', async () => {
      prisma.promo.findUnique.mockResolvedValue(makePromo({ is_active: false }));
      await expect(service.deletePromo('p1', 'admin1')).rejects.toBeInstanceOf(ConflictException);
    });
  });

  // ─── Slice 3b-3: banners ────────────────────────────────────────────

  describe('createBanner', () => {
    it('assigns position = max + 1', async () => {
      prisma.banner.aggregate.mockResolvedValue({ _max: { position: 4 } });
      prisma.banner.create.mockResolvedValue({ id: 'b1', position: 5 });
      const result = await service.createBanner(
        {
          title_ar: 'بنر',
          title_en: 'Banner',
          image_url: 'https://cdn.example/b.webp',
        },
        'admin1',
      );
      expect(result.position).toBe(5);
      expect(prisma.banner.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ position: 5, status: 'DRAFT' }) }),
      );
    });
  });

  describe('moveBanner', () => {
    it('swaps positions atomically with the sibling', async () => {
      prisma.banner.findUnique.mockResolvedValue({ id: 'b2', position: 2 });
      prisma.banner.findFirst.mockResolvedValue({ id: 'b1', position: 1 });
      const result = await service.moveBanner('b2', { direction: 'up' }, 'admin1');
      expect(result.new_position).toBe(1);
      expect(result.swapped_with).toBe('b1');
      expect(prisma.banner.update).toHaveBeenCalledTimes(2);
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('returns 409 BANNER_AT_EDGE when no sibling exists', async () => {
      prisma.banner.findUnique.mockResolvedValue({ id: 'b1', position: 1 });
      prisma.banner.findFirst.mockResolvedValue(null);
      await expect(
        service.moveBanner('b1', { direction: 'up' }, 'admin1'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('returns 404 BANNER_NOT_FOUND for unknown id', async () => {
      prisma.banner.findUnique.mockResolvedValue(null);
      await expect(
        service.moveBanner('missing', { direction: 'up' }, 'admin1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('uploadBannerImage', () => {
    it('calls storage.uploadBannerImage + updates banner.image_url + audits', async () => {
      prisma.banner.findUnique.mockResolvedValue({
        id: 'b1',
        image_url: 'https://old.example/x.webp',
      });
      (storage as unknown as { uploadBannerImage: jest.Mock }).uploadBannerImage = jest
        .fn()
        .mockResolvedValue({ key: 'banners/new.webp', url: 'https://cdn.example/banners/new.webp' });
      const result = await service.uploadBannerImage(
        'b1',
        { buffer: Buffer.from('x'), mimetype: 'image/png' } as unknown as Express.Multer.File,
        'admin1',
      );
      expect(result.key).toBe('banners/new.webp');
      expect(prisma.banner.update).toHaveBeenCalledWith({
        where: { id: 'b1' },
        data: { image_url: 'https://cdn.example/banners/new.webp' },
      });
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });
});
