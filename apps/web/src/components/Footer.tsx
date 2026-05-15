import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { BartalLogo } from './BartalLogo';
import { WhatsappIcon } from './Icons';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const t = dict.web.footer;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT ?? '+249912345678';

  return (
    <footer className="bg-sand border-t border-line mt-16">
      <div className="max-w-[1240px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <BartalLogo locale={locale} size={22} />
            <p className="mt-3 text-small text-ink-mute leading-relaxed">
              {locale === 'ar'
                ? 'بوابتك للتسوق في السودان — توصيل سريع، دفع آمن، خدمة محلية.'
                : 'Your gateway to shopping in Sudan — fast delivery, safe payment, local support.'}
            </p>
          </div>
          <div>
            <div className="text-micro font-bold uppercase tracking-wider text-ink mb-3">
              {locale === 'ar' ? 'تسوق' : 'Shop'}
            </div>
            <ul className="space-y-2 text-small text-ink-mute">
              <li><Link href={`/${locale}/products`} className="hover:text-ink">{dict.web.nav.electronics}</Link></li>
              <li><Link href={`/${locale}/categories/beauty`} className="hover:text-ink">{dict.web.nav.fragrance}</Link></li>
              <li><Link href={`/${locale}/products?sort=newest`} className="hover:text-ink">{dict.web.sections.newArrivals}</Link></li>
              <li><Link href={`/${locale}/products?sort=price_asc`} className="hover:text-ink">{dict.web.nav.offers}</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-micro font-bold uppercase tracking-wider text-ink mb-3">
              {locale === 'ar' ? 'المساعدة' : 'Help'}
            </div>
            <ul className="space-y-2 text-small text-ink-mute">
              <li><span className="hover:text-ink cursor-pointer">{t.shipping}</span></li>
              <li><span className="hover:text-ink cursor-pointer">{t.returns}</span></li>
              <li><span className="hover:text-ink cursor-pointer">{t.contact}</span></li>
            </ul>
          </div>
          <div>
            <div className="text-micro font-bold uppercase tracking-wider text-ink mb-3">
              {t.whatsapp}
            </div>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-small text-amber font-semibold hover:text-amber-soft"
            >
              <WhatsappIcon size={18} />
              <span dir="ltr">{whatsapp}</span>
            </a>
            <p className="mt-3 text-micro text-ink-mute leading-relaxed">
              {locale === 'ar'
                ? 'فريق الدعم متاح يومياً عبر واتساب من ٩ صباحاً إلى ٩ مساءً.'
                : 'Support available daily on WhatsApp from 9am to 9pm.'}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row justify-between gap-3 text-micro text-ink-mute">
          <div>{t.copyright}</div>
          <div className="flex gap-4">
            <span>{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span>{locale === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
