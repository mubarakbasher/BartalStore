'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import type { Order } from '@bartal/shared';
import { submitReviewAction } from '@/lib/orders/actions';
import { StarIcon, CheckIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';

interface Props {
  locale: Locale;
  dict: Dictionary;
  order: Order | null;
}

export function WriteReviewContent({ locale, dict, order }: Props) {
  const isAr = locale === 'ar';
  const t = dict.web.orders.review;

  const [stars, setStars] = useState(5);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState(t.bodyPlaceholder);
  const [title, setTitle] = useState(t.titlePlaceholder);
  const [tags, setTags] = useState<number[]>([0, 2]);
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!order) return;
    setError(null);
    const productId = order.items[0]?.productId;
    if (!productId) return;
    startTransition(async () => {
      const res = await submitReviewAction(productId, { rating: stars, comment: body }, locale);
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(isAr ? res.error.message_ar : res.error.message_en);
      }
    });
  };

  if (!order) {
    return (
      <div className="bg-white border border-line rounded-bartal p-8 text-center">
        <Link
          href={`/${locale}/orders`}
          className="inline-flex items-center justify-center bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
        >
          {dict.web.orders.history.title}
        </Link>
      </div>
    );
  }

  const product = order.items[0];

  if (submitted) {
    return (
      <div className="max-w-[720px] mx-auto">
        <div className="bg-white border border-ok/30 rounded-bartal p-7 text-center">
          <div className="w-16 h-16 rounded-full bg-ok text-white mx-auto mb-3.5 flex items-center justify-center">
            <CheckIcon size={32} color={BARTAL.surface} />
          </div>
          <div className="text-h2 font-bold text-ink mb-2">{t.successTitle}</div>
          <div className="text-small text-ink-mute leading-relaxed mb-5">{t.successBody}</div>
          <Link
            href={`/${locale}/orders/${order.id}`}
            className="inline-flex items-center justify-center bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
          >
            {t.backToOrder}
          </Link>
        </div>
      </div>
    );
  }

  const currentRating = hover || stars;

  return (
    <div>
      <h1 className="text-h1 font-bold text-ink mb-1.5">{t.title}</h1>
      <div className="text-small text-ink-mute mb-5">{t.subtitle}</div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white border border-line rounded-bartal-lg p-6 min-w-0">
          <div className="flex gap-3.5 pb-5 border-b border-line mb-5">
            <div className="w-[72px] h-[72px] rounded-bartal overflow-hidden shrink-0">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name_en} className="w-full h-full object-cover" />
              ) : (
                <ProductPlaceholder
                  label={product.name_en}
                  hue={product.hue as PlaceholderHue}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink-mute uppercase tracking-wider">
                {product.brand}
              </div>
              <div className="text-h3 font-semibold text-ink">
                {isAr ? product.name_ar : product.name_en}
              </div>
              <div className="text-[11px] text-ok mt-1.5 normal-case tracking-normal font-semibold">
                {tt(t.verifiedBuyer, { number: order.number })}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="text-small font-semibold text-ink mb-2">{t.rating}</div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-0.5 cursor-pointer"
                  aria-label={`${n} ${t.ratings[n] ?? ''}`}
                >
                  <StarIcon
                    size={32}
                    color={currentRating >= n ? BARTAL.amber : '#E0DBC9'}
                  />
                </button>
              ))}
              <span className="text-small text-ink font-semibold ms-3">
                {t.ratings[currentRating]}
              </span>
            </div>
          </div>

          <div className="mb-5">
            <div className="text-small font-semibold text-ink mb-2">{t.tagsTitle}</div>
            <div className="flex flex-wrap gap-2">
              {t.tags.map((tag, i) => {
                const on = tags.includes(i);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags((arr) => (on ? arr.filter((x) => x !== i) : [...arr, i]))
                    }
                    className={`px-3.5 py-2 rounded-full text-small font-medium border transition-colors ${
                      on
                        ? 'bg-navy text-white border-navy'
                        : 'bg-sand text-ink border-line hover:border-amber/40'
                    }`}
                  >
                    {on ? '✓ ' : ''}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-small font-semibold text-ink mb-2 block">
              {t.titleLabel}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-3 rounded-bartal border border-line bg-white text-body text-ink outline-none focus:border-amber"
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <label className="text-small font-semibold text-ink">{t.bodyLabel}</label>
              <span className="text-[11px] text-ink-mute">
                {tt(t.bodyCounter, { count: body.length })}
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 500))}
              className="w-full min-h-[120px] px-3.5 py-3 rounded-bartal border border-line bg-white text-body text-ink outline-none focus:border-amber resize-y"
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="mb-5">
            <div className="text-small font-semibold text-ink mb-2">{t.photosLabel}</div>
            <div className="flex gap-2.5">
              {['warm', 'amber', 'rose'].map((hue) => (
                <div
                  key={hue}
                  className="w-20 h-20 rounded-bartal overflow-hidden border border-line"
                >
                  <ProductPlaceholder label="photo" hue={hue as PlaceholderHue} />
                </div>
              ))}
              <button
                type="button"
                className="w-20 h-20 rounded-bartal border-[1.5px] border-dashed border-line bg-sand flex flex-col items-center justify-center hover:border-amber/40 transition-colors"
              >
                <span className="text-[24px] text-ink-mute leading-none">+</span>
                <span className="text-[11px] text-ink-mute mt-0.5 normal-case tracking-normal">
                  {t.addPhoto}
                </span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAnonymous((v) => !v)}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 bg-sand rounded-bartal mb-5 text-start"
          >
            <span
              role="switch"
              aria-checked={anonymous}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                anonymous ? 'bg-amber' : 'bg-line'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  anonymous ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0.5 rtl:-translate-x-0.5'
                }`}
              />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-small text-ink font-semibold">{t.anonymous}</div>
              <div className="text-[11px] text-ink-mute mt-0.5 normal-case tracking-normal">
                {t.anonymousSub}
              </div>
            </div>
          </button>

          {error && (
            <div className="text-small text-danger font-semibold mb-3">{error}</div>
          )}
          <div className="flex gap-2.5 flex-wrap">
            <button
              type="button"
              disabled={pending}
              onClick={submit}
              className="bg-amber text-white rounded-bartal px-7 py-3 text-small font-bold hover:opacity-90 disabled:opacity-60"
            >
              {t.submit}
            </button>
            <button
              type="button"
              className="bg-transparent text-ink border border-line rounded-bartal px-5 py-3 text-small font-semibold hover:bg-sand"
            >
              {t.draft}
            </button>
          </div>
        </div>

        <aside className="space-y-3.5">
          <div className="bg-amber-tint border border-amber/40 rounded-bartal-lg p-4">
            <div className="text-[11px] text-amber font-semibold mb-1.5 uppercase tracking-wider">
              {t.guidelines.tag}
            </div>
            <div className="text-h3 font-bold text-navy-ink mb-2.5">{t.guidelines.title}</div>
            <ul className="ps-4 m-0 text-small text-navy-ink leading-relaxed list-disc space-y-0.5">
              {t.guidelines.items.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-line rounded-bartal-lg p-4">
            <div className="text-[11px] text-ink-mute mb-1.5">{t.moderation.question}</div>
            <div className="text-small text-ink leading-relaxed">{t.moderation.answer}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
