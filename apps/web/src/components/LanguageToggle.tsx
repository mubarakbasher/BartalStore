'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/lib/i18n/config';

interface LanguageToggleProps {
  locale: Locale;
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    const newPath = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${next}`);
    startTransition(() => router.push(newPath));
  };

  return (
    <div className="inline-flex items-center bg-sand rounded-full p-0.5 text-micro font-bold">
      {(['ar', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-3 py-1 rounded-full transition-colors ${
            locale === l
              ? 'bg-amber text-white'
              : 'text-ink-mute hover:text-ink'
          } ${l === 'ar' ? 'font-cairo' : 'font-poppins'}`}
          aria-label={`Switch to ${l.toUpperCase()}`}
        >
          {l === 'ar' ? 'ع' : 'EN'}
        </button>
      ))}
    </div>
  );
}
