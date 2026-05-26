import { Test } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DeliveryZone, OrderStatus } from '@bartal/shared';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { DeliveryService } from '../delivery/delivery.service';
import { NotificationsService } from '../notifications/notifications.service';

jest.mock('../../common/utils/order-number', () => ({
  nextOrderNumber: jest.fn(async () => 'BRT-2026-00042'),
}));
import { nextOrderNumber } from '../../common/utils/order-number';

function makeUser(overrides: Partial<{ id: string; language: 'AR' | 'EN'; is_active: boolean }> = {}) {
  return {
    id: overrides.id ?? 'u1',
    phone: '+249912345678',
    name: 'Mohammed Osman',
    email: 'mo@example.sd',
    password_hash: 'hashed:x',
    is_verified: true,
    is_active: overrides.is_active ?? true,
    role: 'CUSTOMER' as const,
    language: overrides.language ?? ('AR' as const),
    fcm_token: null,
    last_login_at: null,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  };
}

function makeAddress(overrides: Partial<{ id: string; user_id: string; zone: DeliveryZone }> = {}) {
  return {
    id: overrides.id ?? 'a1',
    user_id: overrides.user_id ?? 'u1',
    label: 'Home',
    full_name: 'Mohammed Osman',
    phone: '+249912345678',
    secondary_phone: null,
    district: 'Al-Riyadh',
    street: 'Block 32',
    landmark: 'Next to Al-Nur Mosque',
    delivery_notes: null,
    zone: overrides.zone ?? ('ZONE_B' as DeliveryZone),
    is_default: true,
    created_at: new Date('2026-01-01'),
  };
}

function makeProduct(
  overrides: Partial<{ id: string; stock: number; price: number; is_active: boolean }> = {},
) {
  return {
    id: overrides.id ?? 'p1',
    name_ar: 'كركديه',
    name_en: 'Karkadeh',
    description_ar: '...',
    description_en: '...',
    slug: 'karkadeh',
    sku: 'SKU-1',
    price: new Prisma.Decimal(overrides.price ?? 1500),
    compare_price: null,
    stock: overrides.stock ?? 50,
    low_stock_threshold: 5,
    is_active: overrides.is_active ?? true,
    is_featured: false,
    category_id: 'c1',
    weight_grams: null,
    views_count: 0,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
    images: [{ url: 'https://cdn/karkadeh.webp', is_primary: true }],
  };
}

function makeOrderRow(
  overrides: Partial<{
    id: string;
    status: OrderStatus;
    payment_method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
    items: Array<{ product_id: string; quantity: number }>;
  }> = {},
) {
  const status = overrides.status ?? OrderStatus.AWAITING_PAYMENT;
  const items = (overrides.items ?? [{ product_id: 'p1', quantity: 2 }]).map((i, idx) => ({
    id: `oi${idx}`,
    order_id: overrides.id ?? 'o1',
    product_id: i.product_id,
    product_name_ar: 'كركديه',
    product_name_en: 'Karkadeh',
    product_image: null,
    quantity: i.quantity,
    unit_price: new Prisma.Decimal(1500),
    total_price: new Prisma.Decimal(1500 * i.quantity),
    variant_info: null,
  }));
  return {
    id: overrides.id ?? 'o1',
    order_number: 'BRT-2026-00042',
    user_id: 'u1',
    address_id: 'a1',
    status,
    payment_method: overrides.payment_method ?? 'BANK_TRANSFER',
    payment_status: 'UNPAID' as const,
    subtotal: new Prisma.Decimal(3000),
    delivery_fee: new Prisma.Decimal(1000),
    discount: new Prisma.Decimal(0),
    total: new Prisma.Decimal(4000),
    notes: null,
    internal_notes: null,
    receipt_url: null,
    receipt_uploaded_at: null,
    paid_at: null,
    shipped_at: null,
    delivered_at: null,
    cancelled_at: null,
    cancellation_reason: null,
    created_at: new Date('2026-05-01'),
    updated_at: new Date('2026-05-01'),
    items,
    status_history: [
      {
        id: 'h1',
        order_id: overrides.id ?? 'o1',
        status,
        note: 'Order created',
        changed_by_id: 'u1',
        created_at: new Date('2026-05-01'),
      },
    ],
    address: makeAddress(),
  };
}

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: {
    user: { findUnique: jest.Mock };
    address: { findFirst: jest.Mock };
    product: { findMany: jest.Mock; update: jest.Mock };
    order: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    orderStatusHistory: { create: jest.Mock };
    inventoryMovement: { create: jest.Mock };
    $transaction: jest.Mock;
  };
  let delivery: { calculateFee: jest.Mock };
  let redis: { del: jest.Mock };
  let notifications: { sendSms: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      address: { findFirst: jest.fn() },
      product: { findMany: jest.fn(), update: jest.fn() },
      order: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      orderStatusHistory: { create: jest.fn() },
      inventoryMovement: { create: jest.fn() },
      $transaction: jest.fn(async (arg: unknown) => {
        if (typeof arg === 'function') return (arg as (tx: unknown) => Promise<unknown>)(prisma);
        return Promise.all(arg as Promise<unknown>[]);
      }),
    };
    delivery = {
      calculateFee: jest.fn(async () => ({
        zone: 'ZONE_B' as DeliveryZone,
        cart_total: 3000,
        fee_sdg: 1000,
        free_delivery: false,
        threshold_sdg: 50_000,
        estimated_days_min: 1,
        estimated_days_max: 2,
      })),
    };
    redis = { del: jest.fn(async () => undefined) };
    notifications = { sendSms: jest.fn(async () => undefined) };

    (nextOrderNumber as jest.Mock).mockReset();
    (nextOrderNumber as jest.Mock).mockResolvedValue('BRT-2026-00042');

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
        { provide: DeliveryService, useValue: delivery },
        { provide: RedisService, useValue: redis },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();
    service = moduleRef.get(OrdersService);
  });

  // ─── list ───────────────────────────────────────────────────────────

  describe('list', () => {
    it('paginates with where: { user_id } and returns the snake_case envelope', async () => {
      prisma.order.count.mockResolvedValue(3);
      prisma.order.findMany.mockResolvedValue([makeOrderRow()]);
      const result = await service.list('u1', 1, 20);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 'u1' },
          orderBy: { created_at: 'desc' },
          skip: 0,
          take: 20,
        }),
      );
      expect(result).toMatchObject({
        page: 1,
        limit: 20,
        total: 3,
        total_pages: 1,
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({ order_number: 'BRT-2026-00042' });
    });

    it('clamps page/limit to safe bounds', async () => {
      prisma.order.count.mockResolvedValue(0);
      prisma.order.findMany.mockResolvedValue([]);
      await service.list('u1', -5, 999);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 50 }),
      );
    });
  });

  // ─── detail ─────────────────────────────────────────────────────────

  describe('detail', () => {
    it('returns the order when owned', async () => {
      prisma.order.findFirst.mockResolvedValue(makeOrderRow());
      const result = await service.detail('u1', 'o1');
      expect(prisma.order.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'o1', user_id: 'u1' } }),
      );
      expect(result.id).toBe('o1');
    });

    it('throws ORDER_NOT_FOUND when foreign', async () => {
      prisma.order.findFirst.mockResolvedValue(null);
      await expect(service.detail('attacker', 'o1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ─── create ─────────────────────────────────────────────────────────

  describe('create', () => {
    const baseDto = {
      address_id: 'a1',
      payment_method: 'BANK_TRANSFER' as const,
      items: [{ product_id: 'p1', quantity: 2 }],
    };

    function arrangeHappyPath() {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.address.findFirst.mockResolvedValue(makeAddress());
      prisma.product.findMany.mockResolvedValue([makeProduct({ stock: 50 })]);
      prisma.order.create.mockResolvedValue({ id: 'o1' });
      prisma.product.update.mockResolvedValue({ id: 'p1', sku: 'SKU-1', stock: 48 });
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.order.findUnique.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.AWAITING_PAYMENT, payment_method: 'BANK_TRANSFER' }),
      );
      prisma.order.findFirst.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.AWAITING_PAYMENT, payment_method: 'BANK_TRANSFER' }),
      );
    }

    it('BANK_TRANSFER → status AWAITING_PAYMENT, decrement stock, clear cart, fire SMS', async () => {
      arrangeHappyPath();
      const result = await service.create('u1', baseDto);
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: OrderStatus.AWAITING_PAYMENT }),
        }),
      );
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { stock: { decrement: 2 } },
        select: { id: true, sku: true, stock: true },
      });
      expect(prisma.inventoryMovement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          product_id: 'p1',
          type: 'SALE',
          quantity: -2,
          actor_id: null,
        }),
      });
      expect(redis.del).toHaveBeenCalledWith('bartal:cart:u1');
      expect(notifications.sendSms).toHaveBeenCalled();
      expect(notifications.sendSms.mock.calls[0][1]).toMatch(/BRT-2026-00042/);
      expect(result.status).toBe(OrderStatus.AWAITING_PAYMENT);
    });

    it('CASH_ON_DELIVERY → status PENDING', async () => {
      arrangeHappyPath();
      prisma.order.findUnique.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.PENDING, payment_method: 'CASH_ON_DELIVERY' }),
      );
      const result = await service.create('u1', { ...baseDto, payment_method: 'CASH_ON_DELIVERY' });
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: OrderStatus.PENDING }),
        }),
      );
      expect(result.status).toBe(OrderStatus.PENDING);
    });

    it('throws ADDRESS_NOT_FOUND when the address belongs to someone else', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.address.findFirst.mockResolvedValue(null);
      await expect(service.create('u1', baseDto)).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it('throws USER_NOT_FOUND for inactive user', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_active: false }));
      await expect(service.create('u1', baseDto)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws PRODUCT_NOT_FOUND when an item references an inactive product', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.address.findFirst.mockResolvedValue(makeAddress());
      prisma.product.findMany.mockResolvedValue([makeProduct({ is_active: false })]);
      await expect(service.create('u1', baseDto)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws OUT_OF_STOCK with stock metadata when requested > available', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.address.findFirst.mockResolvedValue(makeAddress());
      prisma.product.findMany.mockResolvedValue([makeProduct({ stock: 1 })]);
      await expect(service.create('u1', baseDto)).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it('still resolves the order when SMS send fails (post-commit isolation)', async () => {
      arrangeHappyPath();
      notifications.sendSms.mockRejectedValueOnce(new Error('boom'));
      const result = await service.create('u1', baseDto);
      expect(result.order_number).toBe('BRT-2026-00042');
    });

    it('retries once on P2002 order_number collision then succeeds', async () => {
      arrangeHappyPath();
      const collision = new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'x',
        meta: { target: ['order_number'] },
      });
      // First $transaction call throws collision; second succeeds.
      const realImpl = prisma.$transaction.getMockImplementation()!;
      prisma.$transaction
        .mockImplementationOnce(async () => {
          throw collision;
        })
        .mockImplementationOnce(realImpl);
      const result = await service.create('u1', baseDto);
      expect(nextOrderNumber).toHaveBeenCalledTimes(2);
      expect(result.order_number).toBe('BRT-2026-00042');
    });
  });

  // ─── cancel ─────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('cancels a PENDING order: status update + history + stock restore + SMS', async () => {
      const row = makeOrderRow({ status: OrderStatus.PENDING });
      prisma.order.findFirst.mockResolvedValueOnce(row);
      prisma.order.update.mockResolvedValue({});
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.product.update.mockResolvedValue({ id: 'p1', sku: 'SKU-1', stock: 52 });
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.order.findFirst.mockResolvedValueOnce({
        ...row,
        status: OrderStatus.CANCELLED,
        cancelled_at: new Date(),
      });

      const result = await service.cancel('u1', 'o1', { reason: 'changed mind' });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: expect.objectContaining({
          status: OrderStatus.CANCELLED,
          cancellation_reason: 'changed mind',
        }),
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { stock: { increment: 2 } },
        select: { id: true, sku: true, stock: true },
      });
      expect(prisma.inventoryMovement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          product_id: 'p1',
          type: 'RETURN',
          quantity: 2,
          actor_id: 'u1',
        }),
      });
      expect(notifications.sendSms).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

    it('rejects INVALID_STATUS_TRANSITION when order is already SHIPPED', async () => {
      prisma.order.findFirst.mockResolvedValue(makeOrderRow({ status: OrderStatus.SHIPPED }));
      await expect(service.cancel('u1', 'o1', {})).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('throws ORDER_NOT_FOUND for foreign orders', async () => {
      prisma.order.findFirst.mockResolvedValue(null);
      await expect(service.cancel('attacker', 'o1', {})).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ─── uploadReceipt ──────────────────────────────────────────────────

  describe('uploadReceipt', () => {
    it('transitions AWAITING_PAYMENT → RECEIPT_UPLOADED, persists URL, fires SMS', async () => {
      const row = makeOrderRow({
        status: OrderStatus.AWAITING_PAYMENT,
        payment_method: 'BANK_TRANSFER',
      });
      prisma.order.findFirst.mockResolvedValueOnce(row);
      prisma.order.update.mockResolvedValue({});
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.order.findFirst.mockResolvedValueOnce({
        ...row,
        status: OrderStatus.RECEIPT_UPLOADED,
        receipt_url: 'https://example.test/receipt.webp',
      });

      const result = await service.uploadReceipt('u1', 'o1', {
        receipt_url: 'https://example.test/receipt.webp',
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: expect.objectContaining({
          status: OrderStatus.RECEIPT_UPLOADED,
          receipt_url: 'https://example.test/receipt.webp',
        }),
      });
      expect(notifications.sendSms).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.RECEIPT_UPLOADED);
    });

    it('rejects COD orders with INVALID_PAYMENT_METHOD', async () => {
      prisma.order.findFirst.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.PENDING, payment_method: 'CASH_ON_DELIVERY' }),
      );
      await expect(
        service.uploadReceipt('u1', 'o1', { receipt_url: 'https://x.test/r.webp' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('rejects DELIVERED order with INVALID_STATUS_TRANSITION', async () => {
      prisma.order.findFirst.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.DELIVERED, payment_method: 'BANK_TRANSFER' }),
      );
      await expect(
        service.uploadReceipt('u1', 'o1', { receipt_url: 'https://x.test/r.webp' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  // ─── admin methods ──────────────────────────────────────────────────

  describe('adminUpdateStatus', () => {
    it('PROCESSING → SHIPPED: updates status, sets shipped_at, history attributed to admin, fires ORDER_SHIPPED SMS', async () => {
      const initial = makeOrderRow({ status: OrderStatus.PROCESSING });
      prisma.order.findUnique
        .mockResolvedValueOnce(initial)
        .mockResolvedValueOnce({ ...initial, status: OrderStatus.SHIPPED, shipped_at: new Date() });
      prisma.order.update.mockResolvedValue({});
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.user.findUnique.mockResolvedValue(makeUser());

      const result = await service.adminUpdateStatus(
        'admin1',
        'o1',
        OrderStatus.SHIPPED,
        'on the way',
      );
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: expect.objectContaining({
          status: OrderStatus.SHIPPED,
          shipped_at: expect.any(Date),
        }),
      });
      expect(prisma.orderStatusHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: OrderStatus.SHIPPED,
          changed_by_id: 'admin1',
          note: 'on the way',
        }),
      });
      expect(notifications.sendSms).toHaveBeenCalled();
      const message = (notifications.sendSms.mock.calls[0] as [string, string])[1];
      expect(message).toMatch(/shipped|شحن/i);
      expect(result.status).toBe(OrderStatus.SHIPPED);
    });

    it('rejects RECEIPT_UPLOADED → PAYMENT_CONFIRMED via INVALID_ADMIN_TRANSITION', async () => {
      prisma.order.findUnique.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.RECEIPT_UPLOADED }),
      );
      await expect(
        service.adminUpdateStatus('admin1', 'o1', OrderStatus.PAYMENT_CONFIRMED),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('PROCESSING → CANCELLED: restores stock per line + fires ORDER_CANCELLED SMS', async () => {
      const initial = makeOrderRow({
        status: OrderStatus.PROCESSING,
        items: [{ product_id: 'p1', quantity: 2 }],
      });
      prisma.order.findUnique
        .mockResolvedValueOnce(initial)
        .mockResolvedValueOnce({ ...initial, status: OrderStatus.CANCELLED });
      prisma.order.update.mockResolvedValue({});
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.product.update.mockResolvedValue({ id: 'p1', sku: 'SKU-1', stock: 52 });
      prisma.user.findUnique.mockResolvedValue(makeUser());

      await service.adminUpdateStatus('admin1', 'o1', OrderStatus.CANCELLED, 'OOS');
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { stock: { increment: 2 } },
        select: { id: true, sku: true, stock: true },
      });
      expect(prisma.inventoryMovement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          product_id: 'p1',
          type: 'RETURN',
          quantity: 2,
          actor_id: 'admin1',
        }),
      });
      expect(notifications.sendSms).toHaveBeenCalled();
    });

    it('throws ORDER_NOT_FOUND when order missing', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.adminUpdateStatus('admin1', 'missing', OrderStatus.SHIPPED),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('adminConfirmPayment', () => {
    it('RECEIPT_UPLOADED → PAYMENT_CONFIRMED + paid_at + SMS', async () => {
      const initial = makeOrderRow({ status: OrderStatus.RECEIPT_UPLOADED });
      prisma.order.findUnique
        .mockResolvedValueOnce(initial)
        .mockResolvedValueOnce({
          ...initial,
          status: OrderStatus.PAYMENT_CONFIRMED,
          payment_status: 'PAID',
          paid_at: new Date(),
        });
      prisma.order.update.mockResolvedValue({});
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.user.findUnique.mockResolvedValue(makeUser());

      const result = await service.adminConfirmPayment('admin1', 'o1');
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: expect.objectContaining({
          status: OrderStatus.PAYMENT_CONFIRMED,
          payment_status: 'PAID',
          paid_at: expect.any(Date),
        }),
      });
      expect(notifications.sendSms).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.PAYMENT_CONFIRMED);
    });

    it('throws INVALID_STATUS_TRANSITION when order is not RECEIPT_UPLOADED', async () => {
      prisma.order.findUnique.mockResolvedValue(
        makeOrderRow({ status: OrderStatus.AWAITING_PAYMENT }),
      );
      await expect(service.adminConfirmPayment('admin1', 'o1')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('adminRejectPayment', () => {
    it('stores reason in history note + fires PAYMENT_REJECTED SMS with reason in message', async () => {
      const initial = makeOrderRow({ status: OrderStatus.RECEIPT_UPLOADED });
      prisma.order.findUnique
        .mockResolvedValueOnce(initial)
        .mockResolvedValueOnce({ ...initial, status: OrderStatus.PAYMENT_REJECTED });
      prisma.order.update.mockResolvedValue({});
      prisma.orderStatusHistory.create.mockResolvedValue({});
      prisma.user.findUnique.mockResolvedValue(makeUser({ language: 'EN' }));

      await service.adminRejectPayment('admin1', 'o1', 'wrong amount');
      expect(prisma.orderStatusHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: OrderStatus.PAYMENT_REJECTED,
          changed_by_id: 'admin1',
          note: 'wrong amount',
        }),
      });
      const message = (notifications.sendSms.mock.calls[0] as [string, string])[1];
      expect(message).toContain('wrong amount');
    });

    it('rejects empty / short reason with 400 REJECTION_REASON_REQUIRED', async () => {
      await expect(
        service.adminRejectPayment('admin1', 'o1', ' '),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.order.findUnique).not.toHaveBeenCalled();
    });
  });
});
