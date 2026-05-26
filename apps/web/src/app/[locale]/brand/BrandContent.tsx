'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';
import { PriceTag } from '@/components/PriceTag';
import { BARTAL } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function BrandContent({ locale, dict }: Props) {
  const t = dict.web.brand;
  const [activeTab, setActiveTab] = useState<string>('products');

  return (
    <div>
      <nav className="border-b border-line bg-white">
        <div className="max-w-[1100px] mx-auto px-6 flex gap-7 overflow-x-auto">
          {t.tabs.map((tab) => {
            const on = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-small whitespace-nowrap border-b-2 transition-colors ${
                  on
                    ? 'text-ink font-bold border-amber'
                    : 'text-ink-mute font-medium border-transparent hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-20">
        {activeTab === 'products' ? (
          <>
            <div className="flex items-center mb-4">
              <div className="text-small text-ink-mute flex-1">{t.pagination}</div>
              <div className="text-[12px] text-ink font-semibold px-3 py-1.5 border border-line rounded-bartal">
                {t.sort} ▼
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.products.map((p) => {
                const discount = p.compare
                  ? Math.round((1 - p.price / p.compare) * 100)
                  : null;
                return (
                  <article
                    key={p.id}
                    className="bg-white rounded-bartal-lg border border-line overflow-hidden"
                  >
                    <div className="h-[200px] relative">
                      <ProductPlaceholder
                        label={p.name}
                        hue={p.hue as PlaceholderHue}
                      />
                      {discount !== null && (
                        <div className="absolute top-3 start-3 px-2.5 py-1 bg-danger text-white text-[11px] font-bold rounded">
                          −{discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <div className="text-[11px] text-ink-mute tracking-wider uppercase font-semibold mb-1">
                        {p.brand} · ★ {p.rating}
                      </div>
                      <div
                        className="text-small font-semibold text-ink leading-snug mb-2 line-clamp-2"
                        style={{ minHeight: 38 }}
                      >
                        {p.name}
                      </div>
                      <PriceTag
                        amount={p.price}
                        locale={locale}
                        size={14}
                        color={BARTAL.amber}
                        compare={p.compare ?? null}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white border border-line rounded-bartal-lg p-10 text-center">
            <div className="text-h2 font-bold text-ink mb-2">
              {t.tabs.find((tab) => tab.id === activeTab)?.label}
            </div>
            <div className="text-small text-ink-mute">{t.tabComingSoon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
