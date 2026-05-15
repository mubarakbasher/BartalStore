import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: {
    category: { findMany: jest.Mock; findFirst: jest.Mock };
    product: { findMany: jest.Mock; count: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      category: { findMany: jest.fn(), findFirst: jest.fn() },
      product: { findMany: jest.fn(), count: jest.fn() },
      $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(CategoriesService);
  });

  it('builds a tree with product counts via _count.products', async () => {
    prisma.category.findMany.mockResolvedValue([
      { id: 'c1', slug: 'electronics', name_ar: 'إ', name_en: 'E', parent_id: null, image_url: null, sort_order: 0, is_active: true, _count: { products: 3 } },
      { id: 'c1a', slug: 'phones', name_ar: 'ه', name_en: 'P', parent_id: 'c1', image_url: null, sort_order: 0, is_active: true, _count: { products: 2 } },
      { id: 'c2', slug: 'fashion', name_ar: 'أ', name_en: 'F', parent_id: null, image_url: null, sort_order: 1, is_active: true, _count: { products: 0 } },
    ]);

    const tree = await service.tree();
    expect(tree).toHaveLength(2);
    const electronics = tree.find((n) => n.slug === 'electronics')!;
    expect(electronics.product_count).toBe(3);
    expect(electronics.children).toHaveLength(1);
    expect(electronics.children[0].slug).toBe('phones');
    expect(electronics.children[0].product_count).toBe(2);
    const fashion = tree.find((n) => n.slug === 'fashion')!;
    expect(fashion.product_count).toBe(0);
  });

  it('throws bilingual NotFound for unknown category', async () => {
    prisma.category.findFirst.mockResolvedValue(null);
    await expect(service.detail('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('productsIn throws when category missing', async () => {
    prisma.category.findFirst.mockResolvedValue(null);
    await expect(service.productsIn('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
