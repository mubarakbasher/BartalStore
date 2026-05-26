'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthCard } from '@/components/AuthCard';
import type { Locale } from '@/lib/i18n/config';
import { loginAction } from '@/lib/auth/actions';
import { notifyAuthChange } from '@/lib/auth/state';
import { syncCartAction } from '@/lib/cart/sync';
import { useCart } from '@/lib/state/cart-store';

interface Props {
  locale: Locale;
  dict: ReturnType<typeof import('@/lib/i18n/dictionary').getDictionary>;
}

export function LoginForm({ locale, dict }: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const cart = useCart();
  const [conflictCount, setConflictCount] = useState(0);

  return (
    <>
      {conflictCount > 0 && (
        <div className="max-w-md mx-auto px-6 mt-6">
          <div
            role="status"
            className="bg-amber-tint border border-amber/40 text-amber px-3 py-2.5 rounded-bartal text-small leading-relaxed normal-case tracking-normal"
          >
            {locale === 'ar'
              ? `تم تخطي ${conflictCount} منتج من سلتك بسبب نفاد المخزون.`
              : `${conflictCount} cart item(s) were skipped because they're out of stock.`}
          </div>
        </div>
      )}
      <AuthCard
        locale={locale}
        title={dict.web.auth.loginTitle}
        subtitle={dict.web.auth.loginSubtitle}
        fields={[
          {
            name: 'phone',
            label: dict.web.auth.phone,
            type: 'tel',
            placeholder: '+249 9XX XXX XXX',
            autoComplete: 'tel',
            required: true,
          },
          {
            name: 'password',
            label: dict.web.auth.password,
            type: 'password',
            autoComplete: 'current-password',
            required: true,
          },
        ]}
        submitLabel={dict.web.auth.submit}
        footer={
          <>
            <Link
              href={`/${locale}/forgot-password`}
              className="text-small text-amber hover:text-amber-soft font-semibold"
            >
              {dict.web.auth.forgot}
            </Link>
            <div className="mt-4 text-small text-ink-mute">
              {dict.web.auth.noAccount}{' '}
              <Link href={`/${locale}/register`} className="text-navy font-semibold hover:text-amber">
                {dict.web.auth.registerTitle}
              </Link>
            </div>
          </>
        }
        onSubmit={async ({ values }) => {
          const phone = (values.phone ?? '').replace(/\s+/g, '').trim();
          const password = values.password ?? '';
          const result = await loginAction({ phone, password }, locale);
          if (!result.ok) {
            throw new Error(locale === 'ar' ? result.error.message_ar : result.error.message_en);
          }
          // Sync local cart → server.
          const localItems = cart.items.map((it) => ({
            product_id: it.product_id,
            quantity: it.quantity,
          }));
          cart.setSyncing(true);
          const sync = await syncCartAction({ items: localItems, locale });
          cart.setSyncing(false);
          if (sync) {
            cart.hydrateFromServer(sync.view.items);
            setConflictCount(sync.conflicts.length);
          }
          notifyAuthChange();
          const next = search.get('next');
          router.replace(next && next.startsWith('/') ? next : `/${locale}/account`);
          router.refresh();
        }}
      />
    </>
  );
}
