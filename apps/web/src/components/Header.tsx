'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { BartalLogo } from './BartalLogo';
import { SearchIcon, BagIcon, UserIcon, HeartIcon } from './Icons';
import { LanguageToggle } from './LanguageToggle';
import { useCart } from '@/lib/state/cart-store';

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
  activeNav?: 'home' | 'electronics' | 'fragrance' | 'offers' | 'categories';
}

export function Header({ locale, dict, activeNav = 'home' }: HeaderProps) {
  const t = dict.web;
  const [cartCount, setCartCount] = useState(0);

  // Avoid hydration mismatch — only read zustand on the client.
  useEffect(() => {
    const update = () => setCartCount(useCart.getState().totalQuantity());
    update();
    return useCart.subscribe(update);
  }, []);

  const links: Array<{ key: typeof activeNav; label: string; href: string }> = [
    { key: 'home', label: t.nav.home, href: `/${locale}` },
    { key: 'electronics', label: t.nav.electronics, href: `/${locale}/categories/electronics` },
    { key: 'fragrance', label: t.nav.fragrance, href: `/${locale}/categories/beauty` },
    { key: 'offers', label: t.nav.offers, href: `/${locale}/products?sort=price_asc` },
  ];

  return (
    <header className="sticky top-0 z-30">
      {/* Announcement bar */}
      <div className="bg-navy-ink text-white px-6 py-2 text-micro text-center tracking-wide">
        {t.announcement}
      </div>

      {/* Main bar */}
      <div className="bg-white border-b border-line">
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center gap-7">
          <Link href={`/${locale}`} className="shrink-0">
            <BartalLogo locale={locale} size={26} />
          </Link>

          <nav className="hidden md:flex items-center gap-7 flex-1">
            {links.map((l) => {
              const on = l.key === activeNav;
              return (
                <Link
                  key={l.key}
                  href={l.href}
                  className={`text-small pb-1 transition-colors ${
                    on
                      ? 'font-bold text-navy border-b-2 border-amber'
                      : 'font-medium text-ink-mute hover:text-ink'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={`/${locale}/search`}
            className="hidden md:flex items-center gap-2 bg-sand rounded-bartal px-3 py-2 text-small text-ink-mute w-60 hover:bg-amber-tint transition-colors"
          >
            <SearchIcon size={14} />
            <span>{t.search.placeholder}</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageToggle locale={locale} />
            <Link
              href={`/${locale}/account`}
              className="text-ink hover:text-navy transition-colors"
              aria-label={t.account.title}
            >
              <UserIcon size={20} />
            </Link>
            <Link
              href={`/${locale}/wishlist`}
              className="hidden sm:block text-ink hover:text-navy transition-colors"
              aria-label={locale === 'ar' ? 'المفضلة' : 'Wishlist'}
            >
              <HeartIcon size={20} />
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="relative text-ink hover:text-navy transition-colors"
              aria-label={t.cart.title}
            >
              <BagIcon size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -end-2 bg-amber text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
