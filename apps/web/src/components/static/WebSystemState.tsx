'use client';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { BARTAL } from '@/design/tokens';

type Kind = '404' | '500' | 'offline';

interface WebSystemStateProps {
  kind: Kind;
  locale: Locale;
  dict: Dictionary;
  onRetry?: () => void;
}

const COLOR: Record<Kind, string> = {
  '404': BARTAL.amber,
  '500': BARTAL.danger,
  offline: BARTAL.navy,
};

const COLOR_CLASS: Record<Kind, { text: string; bg: string; bgTint: string }> = {
  '404':    { text: 'text-amber',  bg: 'bg-amber',  bgTint: 'bg-amber-tint' },
  '500':    { text: 'text-danger', bg: 'bg-danger', bgTint: 'bg-danger/10' },
  offline:  { text: 'text-navy',   bg: 'bg-navy',   bgTint: 'bg-navy/5' },
};

const BADGE: Record<Kind, string> = {
  '404': '?',
  '500': '!',
  offline: '×',
};

export function WebSystemState({ kind, locale, dict, onRetry }: WebSystemStateProps) {
  const s = dict.web.systemState;
  const v = s.variants[kind];
  const c = COLOR_CLASS[kind];
  const patternId = `sys-motif-${useId().replace(/:/g, '')}`;
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    if (kind === 'offline') return;
    const prefix = kind === '404' ? 'RNF' : 'ERR';
    setRef(`${prefix}-${Math.floor(Math.random() * 900000 + 100000)}`);
  }, [kind]);

  const primaryLabel = kind === '404' ? s.actions.backHome : s.actions.tryAgain;
  const primaryHref = `/${locale}`;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.04 }}
        aria-hidden
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <g stroke={COLOR[kind]} strokeWidth="1" fill="none">
              <path d="M50 8 L60 28 L80 22 L72 42 L92 50 L72 58 L80 78 L60 72 L50 92 L40 72 L20 78 L28 58 L8 50 L28 42 L20 22 L40 28 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {kind === 'offline' && (
        <div className="absolute top-0 inset-x-0 bg-danger text-white py-2.5 px-5 text-small font-semibold flex items-center justify-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
          {s.offlineBanner}
        </div>
      )}

      <div className="relative flex items-center gap-5 mb-7">
        {kind === 'offline' ? (
          <WifiOffGlyph color={COLOR[kind]} />
        ) : (
          <div
            className={`font-mono font-bold leading-none ${c.text}`}
            style={{ fontSize: 140, letterSpacing: -6 }}
          >
            {v.code}
          </div>
        )}
        <div
          className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-white font-bold ${c.bg}`}
          style={{ fontSize: 30 }}
          aria-hidden
        >
          {BADGE[kind]}
        </div>
      </div>

      <div
        className={`text-[11px] font-bold uppercase mb-3 ${c.text}`}
        style={{ letterSpacing: 2 }}
      >
        {v.tag}
      </div>
      <h1
        className="text-ink font-bold text-center mb-3 text-balance max-w-[520px]"
        style={{ fontSize: 30, lineHeight: 1.2 }}
      >
        {v.title}
      </h1>
      <p
        className="text-ink-mute text-center max-w-[500px] leading-relaxed mb-8"
        style={{ fontSize: 15 }}
      >
        {v.body}
      </p>

      <div className="flex flex-wrap gap-3 justify-center mb-9">
        {kind === '404' || !onRetry ? (
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center h-12 px-7 bg-amber text-white rounded-bartal font-bold hover:bg-amber-hover transition-colors text-small"
          >
            {primaryLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center h-12 px-7 bg-amber text-white rounded-bartal font-bold hover:bg-amber-hover transition-colors text-small"
          >
            {primaryLabel}
          </button>
        )}
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center h-12 px-7 bg-white border border-line text-ink rounded-bartal font-semibold hover:bg-sand transition-colors text-small"
        >
          {s.actions.contactSupport}
        </Link>
      </div>

      {kind === '404' && (
        <div className="bg-white border border-line rounded-bartal-lg p-5 max-w-[460px] w-full">
          <div className="text-[11px] text-ink-mute uppercase tracking-wider font-semibold mb-2.5">
            {s.suggestionsHeading}
          </div>
          <div className="flex flex-wrap gap-2">
            {s.suggestions.map((sg) => (
              <Link
                key={sg.href}
                href={`/${locale}${sg.href}`}
                className="bg-amber-tint border border-amber/20 text-amber text-micro font-semibold rounded-full px-3.5 py-1.5 hover:bg-amber hover:text-white transition-colors normal-case tracking-normal"
              >
                {sg.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {kind !== 'offline' && ref && (
        <div className="absolute bottom-5 text-micro text-ink-mute font-mono normal-case tracking-normal">
          {s.refLabel}: {ref} · bartal.sd
        </div>
      )}
    </div>
  );
}

function WifiOffGlyph({ color }: { color: string }) {
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" fill="none" aria-hidden>
      <path d="M65 98 L65 98.01" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <path
        d="M40 78 C50 70 80 70 90 78"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 58 C34 46 96 46 106 58"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M10 38 C20 22 110 22 120 38"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M14 18 L116 118"
        stroke={BARTAL.danger}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
