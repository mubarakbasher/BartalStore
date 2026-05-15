'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/lib/state/cart-store';
import { AppButton } from './AppButton';
import { MinusIcon, PlusIcon, CheckIcon } from './Icons';

interface AddToCartControlsProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}

export function AddToCartControls({ product, locale, dict }: AddToCartControlsProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const max = Math.max(product.stock, 1);

  const handleAdd = () => {
    add(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (product.stock === 0) {
    return (
      <AppButton variant="secondary" fullWidth disabled className="mt-4">
        {dict.web.product.outOfStock}
      </AppButton>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-small text-ink font-semibold">{dict.web.product.quantity}</span>
        <div className="flex items-center bg-sand rounded-bartal">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-9 h-9 flex items-center justify-center text-ink hover:bg-amber-tint rounded-s-bartal disabled:opacity-40"
            aria-label={locale === 'ar' ? 'إنقاص' : 'Decrease'}
          >
            <MinusIcon size={16} />
          </button>
          <span className="px-4 font-bold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max}
            className="w-9 h-9 flex items-center justify-center text-ink hover:bg-amber-tint rounded-e-bartal disabled:opacity-40"
            aria-label={locale === 'ar' ? 'زيادة' : 'Increase'}
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <AppButton
          onClick={handleAdd}
          fullWidth
          variant="primary"
          leadingIcon={justAdded ? <CheckIcon size={16} color="#fff" /> : undefined}
        >
          {justAdded
            ? locale === 'ar'
              ? 'تمت الإضافة'
              : 'Added'
            : dict.web.product.addToCart}
        </AppButton>
        <Link
          href={`/${locale}/cart`}
          className="inline-flex items-center justify-center h-11 px-5 rounded-bartal border border-line text-small font-semibold text-ink hover:bg-sand"
        >
          {dict.web.product.buyNow}
        </Link>
      </div>
    </div>
  );
}
