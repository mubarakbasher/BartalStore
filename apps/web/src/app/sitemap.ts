import type { MetadataRoute } from 'next';
import { apiGet } from '@/lib/api/client';
import type { CategoryNode, Product } from '@/lib/api/types';
import { SITE_URL, localizedHref } from '@/lib/seo/site';

export const revalidate = 86_400;

const STATIC_PATHS = [
  '/',
  '/products',
  '/cart',
  '/login',
  '/register',
  '/forgot-password',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/journal',
  '/brand',
] as const;

type Page = MetadataRoute.Sitemap[number];

function entry(path: string, lastModified?: Date | string): Page {
  return {
    url: localizedHref('ar', path),
    lastModified: lastModified ?? new Date(),
    changeFrequency: 'daily',
    alternates: {
      languages: {
        'ar-SD': localizedHref('ar', path),
        en: localizedHref('en', path),
      },
    },
  };
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'}/products?limit=200`, {
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success?: boolean; data?: Product[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<CategoryNode[]> {
  try {
    return await apiGet<CategoryNode[]>('categories', {});
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  const staticEntries: Page[] = STATIC_PATHS.map((p) => entry(p));

  const productEntries: Page[] = products.map((p) =>
    entry(`/products/${p.slug || p.id}`, p.created_at ? new Date(p.created_at) : undefined),
  );

  const categoryEntries: Page[] = categories.map((c) => entry(`/categories/${c.slug}`));

  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily' },
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
  ];
}
