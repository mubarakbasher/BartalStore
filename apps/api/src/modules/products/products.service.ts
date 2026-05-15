import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateReviewDto,
  ListProductsQueryDto,
  SearchProductsQueryDto,
} from './dto/products.dto';

const PRODUCT_INCLUDES = {
  images: { orderBy: { sort_order: 'asc' as const } },
  category: { select: { id: true, slug: true, name_ar: true, name_en: true } },
} satisfies Prisma.ProductInclude;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListProductsQueryDto) {
    const page = Math.max(query.page ?? DEFAULT_PAGE, 1);
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { is_active: true };
    if (query.category) {
      where.category = { slug: query.category };
    }
    if (query.min_price !== undefined || query.max_price !== undefined) {
      where.price = {};
      if (query.min_price !== undefined) where.price.gte = query.min_price;
      if (query.max_price !== undefined) where.price.lte = query.max_price;
    }
    if (query.in_stock) {
      where.stock = { gt: 0 };
    }

    const orderBy = this.orderByForSort(query.sort);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDES,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async detail(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }], is_active: true },
      include: { ...PRODUCT_INCLUDES, variants: true },
    });
    if (!product) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message_en: 'Product not found.',
        message_ar: 'المنتج غير موجود.',
      });
    }
    return product;
  }

  async search(query: SearchProductsQueryDto) {
    const page = Math.max(query.page ?? DEFAULT_PAGE, 1);
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;
    const q = query.q.trim();

    const where: Prisma.ProductWhereInput = {
      is_active: true,
      OR: [
        { name_ar: { contains: q, mode: 'insensitive' } },
        { name_en: { contains: q, mode: 'insensitive' } },
        { description_ar: { contains: q, mode: 'insensitive' } },
        { description_en: { contains: q, mode: 'insensitive' } },
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDES,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items,
      meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1), query: q },
    };
  }

  async listReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { product_id: productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async createReview(_userId: string, _productId: string, _dto: CreateReviewDto) {
    // Auth-gated; needs the orders module to confirm verified purchase. Out of scope.
    throw new NotFoundException({
      code: 'NOT_IMPLEMENTED',
      message_en: 'Review creation lands with the auth + orders pass.',
      message_ar: 'إضافة التقييم تتطلب مرحلة المصادقة والطلبات.',
    });
  }

  private orderByForSort(
    sort: ListProductsQueryDto['sort'],
  ): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'newest':
        return { created_at: 'desc' };
      case 'popular':
        return { views_count: 'desc' };
      default:
        return [{ is_featured: 'desc' }, { created_at: 'desc' }];
    }
  }
}
