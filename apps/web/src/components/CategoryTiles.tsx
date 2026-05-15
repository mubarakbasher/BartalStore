import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { CategoryNode } from '@/lib/api/types';
import { ProductPlaceholder, hueForProduct } from './ProductPlaceholder';

interface CategoryTilesProps {
  locale: Locale;
  dict: Dictionary;
  categories: CategoryNode[];
}

export function CategoryTiles({ locale, dict, categories }: CategoryTilesProps) {
  if (!categories.length) return null;
  const display = categories.slice(0, 6);
  return (
    <section>
      <h2 className="text-h2 font-bold text-ink mb-4">{dict.web.sections.shopByCategory}</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {display.map((c) => {
          const name = locale === 'ar' ? c.name_ar : c.name_en;
          return (
            <Link
              key={c.id}
              href={`/${locale}/categories/${c.slug}`}
              className="group bg-white border border-line rounded-bartal overflow-hidden hover:shadow-card transition-shadow"
            >
              <div className="aspect-[4/3] relative">
                <ProductPlaceholder label={c.name_en} hue={hueForProduct(c.slug)} />
              </div>
              <div className="px-3 py-2.5 text-center">
                <div className="text-small font-semibold text-ink truncate">{name}</div>
                <div className="text-micro text-ink-mute mt-0.5 normal-case tracking-normal">
                  {c.product_count} {locale === 'ar' ? 'منتج' : 'items'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
