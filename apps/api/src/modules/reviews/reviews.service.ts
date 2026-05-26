import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type Review } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateReviewDto,
  ListReviewsQueryDto,
  ReviewSort,
} from './dto/reviews.dto';
import { runAutoFlag } from './helpers/auto-flag';

type ReviewWithUser = Review & { user: { id: string; name: string } };

export interface ReviewView {
  id: string;
  product_id: string;
  user: { id: string; name: string };
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface ReviewSummary {
  count: number;
  average_rating: number | null;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface PaginatedReviews {
  items: ReviewView[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  summary: ReviewSummary;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(productId: string, query: ListReviewsQueryDto): Promise<PaginatedReviews> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, is_active: true },
    });
    if (!product || !product.is_active) throw this.productNotFoundError();

    const page = Math.max(1, Math.floor(query.page ?? 1) || 1);
    const limit = Math.min(50, Math.max(1, Math.floor(query.limit ?? 20) || 20));
    const skip = (page - 1) * limit;
    const orderBy = orderByForSort(query.sort ?? 'newest');

    const publishedWhere = {
      product_id: productId,
      moderation_status: 'APPROVED' as const,
    };

    const [total, rows, groups] = await this.prisma.$transaction([
      this.prisma.review.count({ where: publishedWhere }),
      this.prisma.review.findMany({
        where: publishedWhere,
        include: { user: { select: { id: true, name: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: publishedWhere,
        _count: { rating: true },
        orderBy: { rating: 'desc' },
      }),
    ]);

    const distribution: ReviewSummary['distribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;
    let ratingCount = 0;
    for (const g of groups as Array<{ rating: number; _count: { rating: number } }>) {
      const r = g.rating as 1 | 2 | 3 | 4 | 5;
      const c = g._count.rating;
      if (r >= 1 && r <= 5) distribution[r] = c;
      ratingSum += r * c;
      ratingCount += c;
    }
    const summary: ReviewSummary = {
      count: ratingCount,
      average_rating: ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : null,
      distribution,
    };

    return {
      items: (rows as ReviewWithUser[]).map(toReviewView),
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
      summary,
    };
  }

  async create(
    userId: string,
    productId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewView> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message_en: 'User not found.',
        message_ar: 'المستخدم غير موجود.',
      });
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, is_active: true },
    });
    if (!product || !product.is_active) throw this.productNotFoundError();

    const delivered = await this.prisma.order.findFirst({
      where: {
        user_id: userId,
        status: 'DELIVERED',
        items: { some: { product_id: productId } },
      },
      select: { id: true },
    });
    if (!delivered) {
      throw new ForbiddenException({
        code: 'NOT_A_BUYER',
        message_en: 'Only customers who have received this product can review it.',
        message_ar: 'يمكن فقط للعملاء الذين استلموا هذا المنتج تقييمه.',
      });
    }

    const flagged_reason = runAutoFlag(dto.rating, dto.comment);

    try {
      await this.prisma.review.create({
        data: {
          product_id: productId,
          user_id: userId,
          rating: dto.rating,
          comment: dto.comment ?? null,
          is_verified_purchase: true,
          flagged_reason,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'REVIEW_ALREADY_EXISTS',
          message_en: 'You have already reviewed this product.',
          message_ar: 'لقد قمت بتقييم هذا المنتج بالفعل.',
        });
      }
      throw err;
    }

    const created = (await this.prisma.review.findFirstOrThrow({
      where: { product_id: productId, user_id: userId },
      include: { user: { select: { id: true, name: true } } },
    })) as ReviewWithUser;
    return toReviewView(created);
  }

  private productNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'PRODUCT_NOT_FOUND',
      message_en: 'Product not found.',
      message_ar: 'المنتج غير موجود.',
    });
  }
}

function orderByForSort(
  sort: ReviewSort,
): Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[] {
  switch (sort) {
    case 'highest':
      return [{ rating: 'desc' }, { created_at: 'desc' }];
    case 'lowest':
      return [{ rating: 'asc' }, { created_at: 'desc' }];
    case 'newest':
    default:
      return { created_at: 'desc' };
  }
}

function toReviewView(row: ReviewWithUser): ReviewView {
  return {
    id: row.id,
    product_id: row.product_id,
    user: { id: row.user.id, name: row.user.name },
    rating: row.rating,
    comment: row.comment,
    is_verified_purchase: row.is_verified_purchase,
    created_at: row.created_at.toISOString(),
  };
}
