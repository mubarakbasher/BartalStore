'use client';
import { useMemo, useState, type FormEvent } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { MotifBg } from '@/components/MotifBg';
import { JournalFeaturedCard } from '@/components/static/JournalFeaturedCard';
import { JournalPostCard } from '@/components/static/JournalPostCard';
import { BARTAL } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function JournalContent({ locale, dict }: Props) {
  const t = dict.web.journal;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return t.posts;
    return t.posts.filter((p) => p.categoryId === activeCategory);
  }, [t.posts, activeCategory]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t.newsletter.invalidEmail);
      return;
    }
    setEmailError(null);
    setSubmitted(true);
  };

  return (
    <>
      <JournalFeaturedCard locale={locale} dict={dict} />

      <div className="flex gap-2 mb-7 flex-wrap pb-4 border-b border-line">
        {t.categories.map((c) => {
          const on = c.id === activeCategory;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full text-small font-semibold border transition-colors ${
                on
                  ? 'bg-navy text-white border-navy'
                  : 'bg-transparent text-ink border-line hover:border-amber/40'
              }`}
            >
              {c.label}{' '}
              <span className="opacity-60 ms-1 font-mono">{c.count}</span>
            </button>
          );
        })}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-white border border-line rounded-bartal p-8 text-center mb-12">
          <div className="text-small text-ink-mute">—</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
          {filteredPosts.map((post) => (
            <JournalPostCard key={post.id} post={post} dict={dict} />
          ))}
        </div>
      )}

      <section className="bg-navy-ink text-white rounded-bartal-lg overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
          <MotifBg color={BARTAL.amberSoft} opacity={0.6} style={{ width: '100%', height: '100%' }}>
            <div className="w-full h-full" />
          </MotifBg>
        </div>
        <div className="relative p-8 md:p-9 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-amber-soft tracking-[2px] uppercase font-bold mb-2">
              {t.newsletter.eyebrow}
            </div>
            <div className="font-bold mb-1.5" style={{ fontSize: 24, letterSpacing: locale === 'ar' ? 0 : -0.5 }}>
              {submitted ? t.newsletter.successTitle : t.newsletter.title}
            </div>
            <div className="text-[13px] text-white/70">
              {submitted ? t.newsletter.successBody : t.newsletter.sub}
            </div>
          </div>
          {!submitted && (
            <form onSubmit={handleSubmit} className="flex flex-col items-start gap-1.5">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="px-4 py-3 rounded-bartal border-none text-[13px] bg-white/10 text-white placeholder-white/50 outline-none min-w-[240px]"
                  dir="ltr"
                />
                <button
                  type="submit"
                  className="bg-amber text-white rounded-bartal px-5 py-3 text-[13px] font-bold hover:opacity-90 transition-opacity"
                >
                  {t.newsletter.submit}
                </button>
              </div>
              {emailError && (
                <div className="text-[11px] text-amber-soft font-semibold">{emailError}</div>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  );
}
