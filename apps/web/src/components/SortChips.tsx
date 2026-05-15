'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Dictionary } from '@/lib/i18n/dictionary';

type Sort = 'price_asc' | 'price_desc' | 'newest' | 'popular';

interface SortChipsProps {
  dict: Dictionary;
  active?: Sort;
}

export function SortChips({ dict, active }: SortChipsProps) {
  const pathname = usePathname();
  const params = useSearchParams();

  const buildHref = (sort?: Sort) => {
    const next = new URLSearchParams(params.toString());
    if (sort) next.set('sort', sort);
    else next.delete('sort');
    next.delete('page');
    return `${pathname}?${next.toString()}`;
  };

  const options: Array<{ k?: Sort; label: string }> = [
    { k: 'popular', label: dict.web.filters.sort.bestSelling },
    { k: 'newest', label: dict.web.filters.sort.newest },
    { k: 'price_asc', label: dict.web.filters.sort.priceLow },
    { k: 'price_desc', label: dict.web.filters.sort.priceHigh },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = active === o.k;
        return (
          <Link
            key={o.k}
            href={buildHref(o.k)}
            className={`px-3 h-8 inline-flex items-center rounded-full text-micro font-semibold transition-colors normal-case tracking-normal ${
              on ? 'bg-amber text-white' : 'bg-white border border-line text-ink-mute hover:text-ink'
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}
