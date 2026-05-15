import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: {
    product: { findMany: jest.Mock; findFirst: jest.Mock; count: jest.Mock };
    review: { findMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
      },
      review: { findMany: jest.fn() },
      $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(ProductsService);
  });

  describe('list', () => {
    it('returns paginated products with default page=1, limit=20', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);
      prisma.product.count.mockResolvedValue(2);
      const result = await service.list({});
      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({ page: 1, limit: 20, total: 2, totalPages: 1 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it('caps limit at 100', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);
      await service.list({ limit: 5000 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 100 }));
    });

    it('filters by category slug', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);
      await service.list({ category: 'electronics' });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: { slug: 'electronics' } }),
        }),
      );
    });

    it('filters by price range', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);
      await service.list({ min_price: 1000, max_price: 5000 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ price: { gte: 1000, lte: 5000 } }),
        }),
      );
    });

    it('maps sort options to orderBy', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);
      await service.list({ sort: 'price_asc' });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { price: 'asc' } }),
      );
    });
  });

  describe('detail', () => {
    it('finds by id', async () => {
      prisma.product.findFirst.mockResolvedValue({ id: 'p1', name_en: 'X' });
      const result = await service.detail('p1');
      expect(result.id).toBe('p1');
    });

    it('throws bilingual NotFound when missing', async () => {
      prisma.product.findFirst.mockResolvedValue(null);
      await expect(service.detail('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('search', () => {
    it('searches across AR + EN fields', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);
      await service.search({ q: 'كركديه' });
      const call = prisma.product.findMany.mock.calls[0][0];
      expect(call.where.OR).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name_ar: expect.any(Object) }),
          expect.objectContaining({ name_en: expect.any(Object) }),
        ]),
      );
    });
  });
});
