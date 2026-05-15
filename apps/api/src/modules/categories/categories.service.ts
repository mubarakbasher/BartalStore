import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CategoryNode {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  children: CategoryNode[];
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async tree(): Promise<CategoryNode[]> {
    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
      include: {
        _count: {
          select: { products: { where: { is_active: true } } },
        },
      },
    });

    const nodeById = new Map<string, CategoryNode>();
    categories.forEach((c) =>
      nodeById.set(c.id, {
        id: c.id,
        slug: c.slug,
        name_ar: c.name_ar,
        name_en: c.name_en,
        parent_id: c.parent_id,
        image_url: c.image_url,
        sort_order: c.sort_order,
        is_active: c.is_active,
        product_count: c._count.products,
        children: [],
      }),
    );

    const roots: CategoryNode[] = [];
    nodeById.forEach((node) => {
      if (node.parent_id && nodeById.has(node.parent_id)) {
        nodeById.get(node.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async detail(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }], is_active: true },
      include: {
        children: { where: { is_active: true }, orderBy: { sort_order: 'asc' } },
        parent: { select: { id: true, slug: true, name_ar: true, name_en: true } },
        _count: { select: { products: { where: { is_active: true } } } },
      },
    });
    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message_en: 'Category not found.',
        message_ar: 'القسم غير موجود.',
      });
    }
    return { ...category, product_count: category._count.products };
  }

  async productsIn(id: string, page = 1, limit = 20) {
    const category = await this.prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }], is_active: true },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message_en: 'Category not found.',
        message_ar: 'القسم غير موجود.',
      });
    }
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safePage = Math.max(page, 1);
    const skip = (safePage - 1) * safeLimit;

    const where = { category_id: category.id, is_active: true } as const;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sort_order: 'asc' } },
          category: { select: { id: true, slug: true, name_ar: true, name_en: true } },
        },
        orderBy: [{ is_featured: 'desc' }, { created_at: 'desc' }],
        skip,
        take: safeLimit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
      },
    };
  }
}
