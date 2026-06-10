import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Product, type ProductImage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface WishlistItemView {
  id: string;
  product_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  added_at: Date;
}

type WishlistRow = {
  id: string;
  product_id: string;
  created_at: Date;
  product: Product & { images: ProductImage[] };
};

function toView(row: WishlistRow): WishlistItemView {
  const p = row.product;
  return {
    id: row.id,
    product_id: p.id,
    slug: p.slug,
    name_ar: p.name_ar,
    name_en: p.name_en,
    price: Number(p.price),
    compare_price: p.compare_price ? Number(p.compare_price) : null,
    image_url: p.images[0]?.url ?? null,
    stock: p.stock,
    is_active: p.is_active,
    added_at: row.created_at,
  };
}

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  /** Newest-added first. Inactive products remain listed (UI dims them). */
  async list(userId: string): Promise<WishlistItemView[]> {
    const rows = await this.prisma.wishlistItem.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: { product: { include: { images: { where: { is_primary: true }, take: 1 } } } },
    });
    return rows.map(toView);
  }

  /** Idempotent add. Returns the joined view of the row. */
  async add(userId: string, productId: string): Promise<WishlistItemView> {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.is_active) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message_en: 'Product not found.',
        message_ar: 'المنتج غير موجود.',
      });
    }

    try {
      await this.prisma.wishlistItem.create({ data: { user_id: userId, product_id: productId } });
    } catch (err) {
      // P2002 = already in wishlist; treat as idempotent success.
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) {
        throw err;
      }
    }

    const row = await this.prisma.wishlistItem.findUnique({
      where: { user_id_product_id: { user_id: userId, product_id: productId } },
      include: { product: { include: { images: { where: { is_primary: true }, take: 1 } } } },
    });
    return toView(row as WishlistRow);
  }

  /** Idempotent remove. */
  async remove(userId: string, productId: string): Promise<{ success: true }> {
    await this.prisma.wishlistItem.deleteMany({
      where: { user_id: userId, product_id: productId },
    });
    return { success: true };
  }
}
