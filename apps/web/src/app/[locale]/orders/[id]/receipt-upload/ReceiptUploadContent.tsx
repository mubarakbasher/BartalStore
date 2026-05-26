'use client';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useOrders } from '@/lib/state/orders-store';
import { CameraIcon, CheckIcon } from '@/components/Icons';
import { BARTAL, fmtSDG } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
  orderId: string;
}

const MAX_BYTES = 10 * 1024 * 1024;

export function ReceiptUploadContent({ locale, dict, orderId }: Props) {
  const order = useOrders((s) => s.orders.find((o) => o.id === orderId || o.number === orderId));
  const t = dict.web.orders.receiptUpload;

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!order) {
    return (
      <div className="bg-white border border-line rounded-bartal p-8 text-center">
        <div className="text-h2 font-bold text-ink mb-2">{dict.web.orders.history.empty}</div>
        <Link
          href={`/${locale}/orders`}
          className="inline-flex items-center justify-center bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
        >
          {dict.web.orders.history.title}
        </Link>
      </div>
    );
  }

  const accept = (raw: File | undefined | null) => {
    if (!raw) return;
    if (raw.size > MAX_BYTES) {
      setError(t.tooLarge);
      return;
    }
    setError(null);
    setFile(raw);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => accept(e.target.files?.[0]);
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    accept(e.dataTransfer.files?.[0]);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };
  const openPicker = () => inputRef.current?.click();
  const reset = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

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

  return (
    <div className="max-w-[720px] mx-auto">
      <h1 className="text-h1 font-bold text-ink mb-1.5">{t.title}</h1>
      <div className="text-small text-ink-mute mb-5">
        {tt(t.subtitle, {
          number: order.number,
          amount: fmtSDG(order.total, locale),
        })}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        className={`rounded-bartal-lg px-7 py-12 text-center mb-4 cursor-pointer transition-colors ${
          dragging
            ? 'bg-amber-tint border-2 border-dashed border-amber'
            : 'bg-amber-tint border-[1.5px] border-dashed border-amber hover:opacity-90'
        }`}
      >
        {file ? (
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-amber mx-auto mb-2.5 flex items-center justify-center">
              <CheckIcon size={28} color={BARTAL.surface} />
            </div>
            <div className="text-h3 font-bold text-ink" dir="ltr">
              {file.name}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="text-amber font-bold text-small hover:underline"
            >
              {t.changeFile}
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber mx-auto mb-3 flex items-center justify-center">
              <CameraIcon size={28} color={BARTAL.surface} />
            </div>
            <div className="text-h3 font-bold text-ink mb-1.5">{t.dropHere}</div>
            <div className="text-small text-ink-mute mb-4">{t.formats}</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              className="bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
            >
              {t.chooseFile}
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="text-small text-danger font-semibold mb-3">{error}</div>
      )}

      <div className="bg-white border border-line rounded-bartal p-4 mb-4">
        <div className="text-[11px] text-ink-mute uppercase tracking-wider font-semibold mb-3">
          {t.checklistTitle}
        </div>
        {[
          { id: 'bank', label: t.checklist.bank },
          {
            id: 'amount',
            label: tt(t.checklist.amount, { amount: fmtSDG(order.total, locale) }),
          },
          {
            id: 'reference',
            label: tt(t.checklist.reference, { number: order.number }),
          },
          { id: 'date', label: t.checklist.date },
        ].map((c) => (
          <div key={c.id} className="flex items-center gap-2.5 py-2">
            <div className="w-[18px] h-[18px] rounded-full bg-ok flex items-center justify-center">
              <CheckIcon size={11} color={BARTAL.surface} />
            </div>
            <span className="text-small text-ink">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!file}
          onClick={() => setSubmitted(true)}
          className="bg-amber text-white rounded-bartal px-6 py-3 text-small font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.uploadButton}
        </button>
        <Link
          href={`/${locale}/orders/${order.id}`}
          className="inline-flex items-center justify-center bg-transparent text-ink border border-line rounded-bartal px-5 py-3 text-small font-semibold hover:bg-sand"
        >
          {t.cancel}
        </Link>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
