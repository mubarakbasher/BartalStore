import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../../prisma/prisma.service';

function makeProduct(overrides: Partial<{ id: string; is_active: boolean }> = {}) {
  return {
    id: overrides.id ?? 'p1',
    name_ar: 'منتج',
    name_en: 'Product',
    slug: 'product',
    price: new Prisma.Decimal(1500),
    compare_price: null,
    stock: 10,
    is_active: overrides.is_active ?? true,
    images: [{ url: 'https://cdn/x.webp' }],
  };
}

function makeRow(overrides: Partial<{ id: string; product_id: string }> = {}) {
  return {
    id: overrides.id ?? 'w1',
    product_id: overrides.product_id ?? 'p1',
    created_at: new Date('2026-01-02'),
    product: makeProduct({ id: overrides.product_id ?? 'p1' }),
  };
}

describe('WishlistService', () => {
  let service: WishlistService;
  let prisma: {
    wishlistItem: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      deleteMany: jest.Mock;
    };
    product: { findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      wishlistItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      product: { findUnique: jest.fn() },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [WishlistService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(WishlistService);
  });

  describe('list', () => {
    it('maps rows to the wishlist view (newest first, price coerced)', async () => {
      prisma.wishlistItem.findMany.mockResolvedValue([makeRow()]);
      const result = await service.list('u1');
      expect(prisma.wishlistItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'u1' }, orderBy: { created_at: 'desc' } }),
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'w1',
        product_id: 'p1',
        slug: 'product',
        price: 1500,
        image_url: 'https://cdn/x.webp',
      });
    });
  });

  describe('add', () => {
    it('adds an active product and returns the joined view', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.wishlistItem.create.mockResolvedValue({});
      prisma.wishlistItem.findUnique.mockResolvedValue(makeRow());
      const result = await service.add('u1', 'p1');
      expect(prisma.wishlistItem.create).toHaveBeenCalledWith({
        data: { user_id: 'u1', product_id: 'p1' },
      });
      expect(result).toMatchObject({ product_id: 'p1', slug: 'product' });
    });

    it('is idempotent on P2002 (already in wishlist)', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.wishlistItem.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: '5' }),
      );
      prisma.wishlistItem.findUnique.mockResolvedValue(makeRow());
      const result = await service.add('u1', 'p1');
      expect(result).toMatchObject({ product_id: 'p1' });
    });

    it('throws PRODUCT_NOT_FOUND for missing/inactive products', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.add('u1', 'missing')).rejects.toBeInstanceOf(NotFoundException);

      prisma.product.findUnique.mockResolvedValue(makeProduct({ is_active: false }));
      await expect(service.add('u1', 'p1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('idempotently deletes by user + product', async () => {
      prisma.wishlistItem.deleteMany.mockResolvedValue({ count: 1 });
      const result = await service.remove('u1', 'p1');
      expect(prisma.wishlistItem.deleteMany).toHaveBeenCalledWith({
        where: { user_id: 'u1', product_id: 'p1' },
      });
      expect(result).toEqual({ success: true });
    });
  });
});
