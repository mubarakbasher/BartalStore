import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { AdmCard } from '@/components/primitives/AdmCard';
import { useAdminSettings } from '@/lib/api/queries';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { LEGAL_PAGES, type LegalSlug } from '../legal-pages';

const LABEL: Record<LegalSlug, { ar: string; en: string }> = {
  terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  refund: { ar: 'سياسة الاسترداد', en: 'Refund Policy' },
  shipping: { ar: 'سياسة الشحن', en: 'Shipping Policy' },
  about: { ar: 'من نحن', en: 'About' },
  contact: { ar: 'تواصل معنا', en: 'Contact' },
};

export function LegalTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data: server, isLoading } = useAdminSettings();

  if (isLoading || !server) {
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  return (
    <AdmCard padded={false}>
      <div className="px-5 py-3 border-b border-line dark:border-d-line">
        <div className="text-h3 font-semibold text-ink dark:text-d-text">
          {locale === 'ar' ? 'الصفحات القانونية' : 'Legal pages'}
        </div>
        <div className="text-small text-ink-mute dark:text-d-textMute mt-0.5">
          {locale === 'ar'
            ? 'حرّر النصوص بالعربية والإنجليزية. يحتاج الموقع لإعادة تحميل لتطبيق التغييرات.'
            : 'Edit AR + EN body for each page. The website needs a reload to pick up changes.'}
        </div>
      </div>
      <ul className="divide-y divide-line dark:divide-d-line">
        {LEGAL_PAGES.map((slug) => {
          const status = server[`legal.${slug}.status`] ?? 'DRAFT';
          return (
            <li key={slug} className="px-5 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-small font-semibold text-ink dark:text-d-text">
                  {locale === 'ar' ? LABEL[slug].ar : LABEL[slug].en}
                </div>
                <div className="text-micro text-ink-mute dark:text-d-textMute font-mono">
                  bartal.sd/{slug}
                </div>
              </div>
              <span
                className={clsx(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold',
                  status === 'PUBLISHED'
                    ? 'bg-ok/15 text-ok'
                    : 'bg-line text-ink-mute dark:bg-d-raised dark:text-d-textMute',
                )}
              >
                ● {status}
              </span>
              <Link
                to={`/settings/legal/${slug}`}
                className="text-small text-amber font-semibold hover:underline"
              >
                {locale === 'ar' ? 'تعديل ←' : 'Edit ›'}
              </Link>
            </li>
          );
        })}
      </ul>
    </AdmCard>
  );
}
