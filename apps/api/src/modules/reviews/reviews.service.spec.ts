import { Test } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../prisma/prisma.service';

function makeReview(overrides: Partial<{ id: string; rating: number; comment: string | null; user_id: string }> = {}) {
  return {
    id: overrides.id ?? 'r1',
    product_id: 'p1',
    user_id: overrides.user_id ?? 'u1',
    rating: overrides.rating ?? 5,
    comment: overrides.comment === undefined ? 'great' : overrides.comment,
    is_verified_purchase: true,
    created_at: new Date('2026-05-01'),
    user: { id: overrides.user_id ?? 'u1', name: 'Reviewer' },
  };
}

function makeUser(overrides: Partial<{ id: string; is_active: boolean }> = {}) {
  return {
    id: overrides.id ?? 'u1',
    phone: '+249912345678',
    name: 'Buyer',
    email: null,
    password_hash: 'h',
    is_verified: true,
    is_active: overrides.is_active ?? true,
    role: 'CUSTOMER' as const,
    language: 'AR' as const,
    fcm_token: null,
    last_login_at: null,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  };
}

function makeProduct(overrides: Partial<{ id: string; is_active: boolean }> = {}) {
  return {
    id: overrides.id ?? 'p1',
    is_active: overrides.is_active ?? true,
  };
}

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    product: { findUnique: jest.Mock };
    user: { findUnique: jest.Mock };
    order: { findFirst: jest.Mock };
    review: {
      findMany: jest.Mock;
      findFirstOrThrow: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      groupBy: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      product: { findUnique: jest.fn() },
      user: { findUnique: jest.fn() },
      order: { findFirst: jest.fn() },
      review: {
        findMany: jest.fn(),
        findFirstOrThrow: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        groupBy: jest.fn(),
      },
      $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(ReviewsService);
  });

  // ─── list ───────────────────────────────────────────────────────────

  describe('list', () => {
    it('returns paginated items + summary; default sort=newest', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.review.count.mockResolvedValue(3);
      prisma.review.findMany.mockResolvedValue([makeReview({ rating: 5 }), makeReview({ id: 'r2', rating: 4 })]);
      prisma.review.groupBy.mockResolvedValue([
        { rating: 5, _count: { rating: 2 } },
        { rating: 4, _count: { rating: 1 } },
      ]);

      const result = await service.list('p1', { page: 1, limit: 20 });

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { product_id: 'p1', moderation_status: 'APPROVED' },
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
        summary: {
          count: 3,
          average_rating: 4.7,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 2 },
        },
      });
      expect(result.items).toHaveLength(2);
      expect(result.items[0].is_verified_purchase).toBe(true);
    });

    it('clamps page/limit to safe bounds', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.groupBy.mockResolvedValue([]);
      await service.list('p1', { page: -5, limit: 999 });
      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 50 }),
      );
    });

    it('throws PRODUCT_NOT_FOUND when product missing/inactive', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.list('missing', {})).rejects.toBeInstanceOf(NotFoundException);
    });

    it('sort=highest → orderBy rating desc then created_at desc', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.groupBy.mockResolvedValue([]);
      await service.list('p1', { sort: 'highest' });
      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ rating: 'desc' }, { created_at: 'desc' }],
        }),
      );
    });

    it('summary average_rating is null for zero reviews', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.groupBy.mockResolvedValue([]);
      const result = await service.list('p1', {});
      expect(result.summary).toEqual({
        count: 0,
        average_rating: null,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    });

    it('count + groupBy filter to APPROVED-only (non-APPROVED rows excluded from summary)', async () => {
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.review.count.mockResolvedValue(0);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.groupBy.mockResolvedValue([]);
      await service.list('p1', {});
      expect(prisma.review.count).toHaveBeenCalledWith({
        where: { product_id: 'p1', moderation_status: 'APPROVED' },
      });
      expect(prisma.review.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { product_id: 'p1', moderation_status: 'APPROVED' },
        }),
      );
    });
  });

  // ─── create ─────────────────────────────────────────────────────────

  describe('create', () => {
    function arrangeHappy() {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.order.findFirst.mockResolvedValue({ id: 'o1' });
      prisma.review.create.mockResolvedValue(makeReview());
      prisma.review.findFirstOrThrow.mockResolvedValue(makeReview());
    }

    it('creates with is_verified_purchase=true; returns ReviewView', async () => {
      arrangeHappy();
      const result = await service.create('u1', 'p1', { rating: 5, comment: 'great' });
      expect(prisma.order.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: 'u1',
          status: 'DELIVERED',
          items: { some: { product_id: 'p1' } },
        },
        select: { id: true },
      });
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          product_id: 'p1',
          user_id: 'u1',
          rating: 5,
          comment: 'great',
          is_verified_purchase: true,
          flagged_reason: null,
        }),
      });
      expect(result.is_verified_purchase).toBe(true);
      expect(result.user.name).toBe('Reviewer');
    });

    it('auto-flags reviews containing spam keywords', async () => {
      arrangeHappy();
      await service.create('u1', 'p1', { rating: 1, comment: 'arrived defective and broken' });
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          flagged_reason: 'Auto-flag: contains "defective"',
        }),
      });
    });

    it('auto-flags reviews containing URLs', async () => {
      arrangeHappy();
      await service.create('u1', 'p1', { rating: 5, comment: 'visit www.spamsite.example' });
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          flagged_reason: 'Auto-flag: contains URL',
        }),
      });
    });

    it('auto-flags combined URL + spam keyword as compound reason', async () => {
      arrangeHappy();
      await service.create('u1', 'p1', { rating: 1, comment: 'fake! see https://bad.example' });
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          flagged_reason: 'Auto-flag: spam keywords + URL',
        }),
      });
    });

    it('throws USER_NOT_FOUND for inactive user', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_active: false }));
      await expect(
        service.create('u1', 'p1', { rating: 5 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.review.create).not.toHaveBeenCalled();
    });

    it('throws PRODUCT_NOT_FOUND for inactive product', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.product.findUnique.mockResolvedValue(makeProduct({ is_active: false }));
      await expect(
        service.create('u1', 'p1', { rating: 5 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws NOT_A_BUYER when no delivered order exists', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.product.findUnique.mockResolvedValue(makeProduct());
      prisma.order.findFirst.mockResolvedValue(null);
      await expect(
        service.create('u1', 'p1', { rating: 5 }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(prisma.review.create).not.toHaveBeenCalled();
    });

    it('rethrows P2002 as REVIEW_ALREADY_EXISTS (409)', async () => {
      arrangeHappy();
      prisma.review.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('dup', {
          code: 'P2002',
          clientVersion: 'x',
          meta: { target: ['product_id', 'user_id'] },
        }),
      );
      await expect(
        service.create('u1', 'p1', { rating: 5 }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
