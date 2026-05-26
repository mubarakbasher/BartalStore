import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { DeliveryService } from '../delivery/delivery.service';

const CART_TTL = 30 * 24 * 60 * 60;
const cartKey = (uid: string) => `bartal:cart:${uid}`;

function makeProduct(overrides: Partial<{ id: string; stock: number; is_active: boolean; price: number; image: string | null }> = {}) {
  const price = overrides.price ?? 10_000;
  const imageUrl = overrides.image === undefined ? 'https://cdn/img.webp' : overrides.image;
  return {
    id: overrides.id ?? 'p1',
    slug: 'royal-oud',
    name_ar: 'دهن العود',
    name_en: 'Royal Oud',
    description_ar: '',
    description_en: '',
    sku: 'SKU-1',
    price: new Prisma.Decimal(price),
    compare_price: null,
    stock: overrides.stock ?? 5,
    low_stock_threshold: 5,
    is_active: overrides.is_active ?? true,
    is_featured: false,
    category_id: 'cat1',
    weight_grams: null,
    views_count: 0,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
    images: imageUrl ? [{ id: 'img1', product_id: 'p1', url: imageUrl, alt_ar: null, alt_en: null, sort_order: 0, is_primary: true }] : [],
  };
}

function makeAddress(overrides: Partial<{ user_id: string; zone: string; is_default: boolean }> = {}) {
  return {
    id: 'a1',
    user_id: overrides.user_id ?? 'u1',
    label: 'Home',
    full_name: 'Mohammed',
    phone: '+249912345678',
    secondary_phone: null,
    district: 'Riyadh',
    street: null,
    landmark: 'Mosque',
    delivery_notes: null,
    zone: overrides.zone ?? 'ZONE_B',
    is_default: overrides.is_default ?? true,
    created_at: new Date(),
  };
}

describe('CartService', () => {
  let service: CartService;
  let prisma: {
    product: { findUnique: jest.Mock; findMany: jest.Mock };
    address: { findFirst: jest.Mock };
    cartSession: { upsert: jest.Mock; deleteMany: jest.Mock };
  };
  let redis: { get: jest.Mock; setex: jest.Mock; del: jest.Mock };
  let delivery: { calculateFee: jest.Mock };

  beforeEach(async () => {
    prisma = {
      product: { findUnique: jest.fn(), findMany: jest.fn() },
      address: { findFirst: jest.fn() },
      cartSession: {
        upsert: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
    };
    redis = { get: jest.fn(), setex: jest.fn(), del: jest.fn() };
    delivery = {
      calculateFee: jest.fn().mockResolvedValue({
        zone: 'ZONE_B',
        cart_total: 0,
        fee_sdg: 800,
        free_delivery: false,
        threshold_sdg: 50000,
        estimated_days_min: 1,
        estimated_days_max: 2,
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisService, useValue: redis },
        { provide: DeliveryService, useValue: delivery },
      ],
    }).compile();

    service = moduleRef.get(CartService);
  });

  describe('get', () => {
    it('returns an empty cart on Redis miss with requires_address when no default address', async () => {
      redis.get.mockResolvedValue(null);
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.get('u1');
      expect(result).toEqual({
        items: [],
        total_quantity: 0,
        subtotal: 0,
        delivery_preview: null,
        total: 0,
        requires_address: true,
      });
      expect(delivery.calculateFee).not.toHaveBeenCalled();
    });

    it('joins stored items against products and attaches delivery preview from default address', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 2 }]));
      prisma.product.findMany.mockResolvedValue([makeProduct({ price: 10_000 })]);
      prisma.address.findFirst.mockResolvedValue(makeAddress({ zone: 'ZONE_A' }));
      delivery.calculateFee.mockResolvedValue({
        zone: 'ZONE_A', cart_total: 20_000, fee_sdg: 500, free_delivery: false,
        threshold_sdg: 50_000, estimated_days_min: 1, estimated_days_max: 1,
      });

      const result = await service.get('u1');
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({ product_id: 'p1', unit_price: 10_000, quantity: 2, line_total: 20_000 });
      expect(result.subtotal).toBe(20_000);
      expect(result.total).toBe(20_500);
      expect(result.delivery_preview).toMatchObject({ zone: 'ZONE_A', fee: 500 });
      expect(delivery.calculateFee).toHaveBeenCalledWith('ZONE_A', 20_000);
    });

    it('drops inactive products and writes back a cleaned cart (self-heal)', async () => {
      redis.get.mockResolvedValue(JSON.stringify([
        { product_id: 'p1', quantity: 1 },
        { product_id: 'p2', quantity: 1 },
      ]));
      prisma.product.findMany.mockResolvedValue([
        makeProduct({ id: 'p1' }),
        makeProduct({ id: 'p2', is_active: false }),
      ]);
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.get('u1');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].product_id).toBe('p1');
      expect(redis.setex).toHaveBeenCalledWith(
        cartKey('u1'),
        CART_TTL,
        JSON.stringify([{ product_id: 'p1', quantity: 1 }]),
      );
    });

    it('returns an empty cart and deletes the Redis key when every product was dropped', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 1 }]));
      prisma.product.findMany.mockResolvedValue([]);
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.get('u1');
      expect(result.items).toHaveLength(0);
      expect(redis.del).toHaveBeenCalledWith(cartKey('u1'));
      expect(redis.setex).not.toHaveBeenCalled();
    });

    it('resets a corrupt Redis payload', async () => {
      redis.get.mockResolvedValue('not-json{');
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.get('u1');
      expect(result.items).toHaveLength(0);
      expect(redis.del).toHaveBeenCalledWith(cartKey('u1'));
    });
  });

  describe('addItem', () => {
    it('writes a new line with the requested quantity using the 30-day TTL', async () => {
      redis.get.mockResolvedValue(null);
      prisma.product.findUnique.mockResolvedValue(makeProduct({ stock: 10 }));
      prisma.product.findMany.mockResolvedValue([makeProduct({ stock: 10 })]);
      prisma.address.findFirst.mockResolvedValue(null);

      await service.addItem('u1', { product_id: 'p1', quantity: 2 });
      expect(redis.setex).toHaveBeenCalledWith(
        cartKey('u1'),
        CART_TTL,
        JSON.stringify([{ product_id: 'p1', quantity: 2 }]),
      );
    });

    it('merges with an existing line by summing quantities', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 1 }]));
      prisma.product.findUnique.mockResolvedValue(makeProduct({ stock: 10 }));
      prisma.product.findMany.mockResolvedValue([makeProduct({ stock: 10 })]);
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.addItem('u1', { product_id: 'p1', quantity: 2 });
      expect(result.items[0].quantity).toBe(3);
      expect(redis.setex).toHaveBeenCalledWith(
        cartKey('u1'),
        CART_TTL,
        JSON.stringify([{ product_id: 'p1', quantity: 3 }]),
      );
    });

    it('rejects with OUT_OF_STOCK when the merged quantity exceeds product.stock', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 4 }]));
      prisma.product.findUnique.mockResolvedValue(makeProduct({ stock: 5 }));

      await expect(
        service.addItem('u1', { product_id: 'p1', quantity: 3 }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(redis.setex).not.toHaveBeenCalled();
    });

    it('throws PRODUCT_NOT_FOUND for missing / inactive products', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(
        service.addItem('u1', { product_id: 'gone', quantity: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      prisma.product.findUnique.mockResolvedValue(makeProduct({ is_active: false }));
      await expect(
        service.addItem('u1', { product_id: 'p1', quantity: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateItem', () => {
    it('replaces the quantity for an existing line', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 1 }]));
      prisma.product.findUnique.mockResolvedValue(makeProduct({ stock: 10 }));
      prisma.product.findMany.mockResolvedValue([makeProduct({ stock: 10 })]);
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.updateItem('u1', 'p1', { quantity: 4 });
      expect(result.items[0].quantity).toBe(4);
      expect(redis.setex).toHaveBeenCalledWith(
        cartKey('u1'),
        CART_TTL,
        JSON.stringify([{ product_id: 'p1', quantity: 4 }]),
      );
    });

    it('throws ITEM_NOT_IN_CART when the product is missing from the cart', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p2', quantity: 1 }]));
      prisma.product.findUnique.mockResolvedValue(makeProduct());

      await expect(
        service.updateItem('u1', 'p1', { quantity: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(redis.setex).not.toHaveBeenCalled();
    });

    it('throws OUT_OF_STOCK when the requested quantity exceeds stock', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 1 }]));
      prisma.product.findUnique.mockResolvedValue(makeProduct({ stock: 3 }));

      await expect(
        service.updateItem('u1', 'p1', { quantity: 10 }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('removeItem', () => {
    it('filters the item out and writes back the remainder', async () => {
      redis.get.mockResolvedValue(JSON.stringify([
        { product_id: 'p1', quantity: 1 },
        { product_id: 'p2', quantity: 2 },
      ]));
      prisma.product.findMany.mockResolvedValue([makeProduct({ id: 'p2' })]);
      prisma.address.findFirst.mockResolvedValue(null);

      await service.removeItem('u1', 'p1');
      expect(redis.setex).toHaveBeenCalledWith(
        cartKey('u1'),
        CART_TTL,
        JSON.stringify([{ product_id: 'p2', quantity: 2 }]),
      );
    });

    it('deletes the Redis key when the cart becomes empty', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 1 }]));
      prisma.address.findFirst.mockResolvedValue(null);

      await service.removeItem('u1', 'p1');
      expect(redis.del).toHaveBeenCalledWith(cartKey('u1'));
      expect(redis.setex).not.toHaveBeenCalled();
    });

    it('is a no-op when the product is not in the cart', async () => {
      redis.get.mockResolvedValue(JSON.stringify([{ product_id: 'p1', quantity: 1 }]));
      prisma.product.findMany.mockResolvedValue([makeProduct()]);
      prisma.address.findFirst.mockResolvedValue(null);

      await service.removeItem('u1', 'p2');
      expect(redis.setex).not.toHaveBeenCalled();
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('deletes the Redis key and returns an empty view', async () => {
      redis.get.mockResolvedValue(null);
      prisma.address.findFirst.mockResolvedValue(null);

      const result = await service.clear('u1');
      expect(redis.del).toHaveBeenCalledWith(cartKey('u1'));
      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
    });
  });

  // Slice 3b-1: cart_sessions DB mirror for admin abandoned-carts query.
  describe('cart_sessions DB mirror', () => {
    it('upserts cart_sessions when an item is added', async () => {
      redis.get.mockResolvedValue(null);
      prisma.product.findUnique.mockResolvedValue(makeProduct({ id: 'p1', stock: 10 }));
      prisma.product.findMany.mockResolvedValue([makeProduct({ id: 'p1', stock: 10 })]);
      prisma.address.findFirst.mockResolvedValue(null);
      await service.addItem('u1', { product_id: 'p1', quantity: 2 });
      expect(prisma.cartSession.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 'u1' },
          create: expect.objectContaining({ user_id: 'u1' }),
        }),
      );
    });

    it('deletes the cart_sessions row when the cart is cleared', async () => {
      redis.get.mockResolvedValue(null);
      prisma.address.findFirst.mockResolvedValue(null);
      await service.clear('u1');
      expect(prisma.cartSession.deleteMany).toHaveBeenCalledWith({ where: { user_id: 'u1' } });
    });

    it('does NOT throw when the DB mirror fails', async () => {
      redis.get.mockResolvedValue(null);
      prisma.product.findUnique.mockResolvedValue(makeProduct({ id: 'p1', stock: 10 }));
      prisma.product.findMany.mockResolvedValue([makeProduct({ id: 'p1', stock: 10 })]);
      prisma.address.findFirst.mockResolvedValue(null);
      prisma.cartSession.upsert.mockRejectedValue(new Error('db down'));
      await expect(
        service.addItem('u1', { product_id: 'p1', quantity: 1 }),
      ).resolves.toBeDefined();
    });
  });
});
