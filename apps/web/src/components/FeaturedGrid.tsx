import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Product } from '@/lib/api/types';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';

interface FeaturedGridProps {
  title: string;
  seeAllLabel: string;
  href: string;
  products: Product[];
  locale: Locale;
}

export function FeaturedGrid({ title, seeAllLabel, href, products, locale }: FeaturedGridProps) {
  if (products.length === 0) {
    return (
      <section>
        <h2 className="text-h2 font-bold text-ink mb-4">{title}</h2>
        <div className="bg-white border border-line rounded-bartal-lg">
          <EmptyState
            title={locale === 'ar' ? 'لا توجد منتجات' : 'No products yet'}
            hint={
              locale === 'ar'
                ? 'تأكد من أن واجهة برمجة التطبيقات تعمل على المنفذ ٣٠٠١.'
                : 'Confirm the API is running on port 3001.'
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-h2 font-bold text-ink">{title}</h2>
        <Link href={href} className="text-small font-semibold text-amber hover:text-amber-soft">
          {seeAllLabel} →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
