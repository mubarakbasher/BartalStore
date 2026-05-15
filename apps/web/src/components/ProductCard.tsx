'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Product } from '@/lib/api/types';
import { ProductPlaceholder, hueForProduct } from './ProductPlaceholder';
import { PriceTag } from './PriceTag';

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const tagline = locale === 'ar' ? product.description_ar : product.description_en;
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const hue = hueForProduct(product.slug);
  const lowStock = product.stock > 0 && product.stock <= product.low_stock_threshold;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group block bg-white border border-line rounded-bartal overflow-hidden transition-shadow duration-200 hover:shadow-card"
    >
      <div className="relative aspect-square">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={(locale === 'ar' ? primaryImage.alt_ar : primaryImage.alt_en) ?? name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ProductPlaceholder label={product.name_en} hue={hue} />
        )}
        {product.is_featured && (
          <div className="absolute top-2 start-2 bg-amber text-white text-micro font-bold uppercase px-2 py-1 rounded-full tracking-wider">
            {locale === 'ar' ? 'مميّز' : 'Featured'}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-navy-ink/40 flex items-center justify-center">
            <span className="bg-white/95 text-ink text-small font-semibold px-3 py-1 rounded-full">
              {locale === 'ar' ? 'نفذت الكمية' : 'Out of stock'}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-micro text-ink-mute font-semibold uppercase tracking-wider truncate">
          {product.category.name_en}
        </div>
        <div className="mt-1 text-small font-semibold text-ink line-clamp-2 min-h-[2.6em]">
          {name}
        </div>
        {tagline && (
          <div className="mt-1 text-micro text-ink-mute line-clamp-1 normal-case tracking-normal">
            {tagline}
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          <PriceTag
            amount={Number(product.price)}
            locale={locale}
            size={14}
            color="#D4860B"
            compare={product.compare_price ? Number(product.compare_price) : null}
          />
          {lowStock && (
            <span className="text-micro text-amber font-semibold">
              {locale === 'ar' ? `تبقى ${product.stock}` : `${product.stock} left`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
