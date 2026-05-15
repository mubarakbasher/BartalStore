import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { CategoryNode } from '@/lib/api/types';

interface CategoryFilterProps {
  locale: Locale;
  dict: Dictionary;
  categories: CategoryNode[];
  active?: string;
}

export function CategoryFilter({ locale, dict, categories, active }: CategoryFilterProps) {
  return (
    <div className="bg-white border border-line rounded-bartal-lg p-5 sticky top-32">
      <div className="text-small font-bold text-ink mb-3">{dict.web.filters.title}</div>

      <div className="mb-5">
        <div className="text-micro font-semibold text-ink mb-2 uppercase tracking-wider">
          {dict.web.nav.categories}
        </div>
        <ul className="space-y-1.5">
          <li>
            <Link
              href={`/${locale}/products`}
              className={`block text-small px-2 py-1 rounded-md ${
                !active ? 'bg-amber-tint text-amber font-semibold' : 'text-ink-mute hover:text-ink'
              }`}
            >
              {locale === 'ar' ? 'الكل' : 'All'}
            </Link>
          </li>
          {categories.map((c) => {
            const on = c.slug === active;
            return (
              <li key={c.id} className="flex items-center justify-between">
                <Link
                  href={`/${locale}/products?category=${c.slug}`}
                  className={`flex-1 text-small px-2 py-1 rounded-md ${
                    on ? 'bg-amber-tint text-amber font-semibold' : 'text-ink-mute hover:text-ink'
                  }`}
                >
                  {locale === 'ar' ? c.name_ar : c.name_en}
                </Link>
                <span className="text-micro text-ink-mute">{c.product_count}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Decorative filter previews (not yet wired up to query state) */}
      <div className="mb-5">
        <div className="text-micro font-semibold text-ink mb-2 uppercase tracking-wider">
          {dict.web.filters.price}
        </div>
        <div className="h-1 bg-line rounded relative my-3">
          <div className="absolute start-[15%] w-[60%] h-full bg-amber rounded" />
          <div className="absolute start-[15%] -top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber" />
          <div className="absolute start-[75%] -top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber" />
        </div>
        <div className="flex justify-between text-micro text-ink-mute font-mono normal-case tracking-normal">
          <span>3,000</span>
          <span>620,000</span>
        </div>
      </div>

      <div>
        <div className="text-micro font-semibold text-ink mb-2 uppercase tracking-wider">
          {dict.web.filters.delivery}
        </div>
        <label className="flex items-center gap-2 text-small text-ink py-1 cursor-pointer">
          <span className="w-4 h-4 rounded border-2 border-line" />
          <span>{dict.web.filters.sameDay}</span>
        </label>
      </div>
    </div>
  );
}
