import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebStaticShell } from '@/components/static/WebStaticShell';
import { ContactForm } from '@/components/static/ContactForm';
import { WhatsappIcon } from '@/components/Icons';

const WHATSAPP_GREEN = '#25D366';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const c = dict.web.contact;
  const ch = c.channels;
  const waNumber = ch.whatsapp.value.replace(/[\s+]/g, '');

  return (
    <WebStaticShell eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
        <ContactForm dict={dict} />

        <aside>
          <div className="text-h3 font-semibold text-ink mb-5">{ch.heading}</div>

          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-bartal p-4 mb-3 hover:shadow-card transition-shadow relative overflow-hidden"
            style={{ border: `1px solid ${WHATSAPP_GREEN}55` }}
          >
            <span
              className="absolute top-2.5 text-[9px] font-bold tracking-[1px] text-white px-1.5 py-0.5 rounded-md"
              style={{ background: WHATSAPP_GREEN, insetInlineEnd: 10 }}
            >
              {ch.preferred}
            </span>
            <div className="flex items-start gap-3.5">
              <div
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: WHATSAPP_GREEN }}
              >
                <WhatsappIcon size={22} color="#ffffff" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-small font-bold text-ink mb-1">
                  {ch.whatsapp.title}
                </div>
                <div
                  className="text-amber font-mono font-semibold mb-1 normal-case tracking-normal truncate"
                  dir="ltr"
                  style={{ fontSize: 15 }}
                >
                  {ch.whatsapp.value}
                </div>
                <div className="text-[11px] text-ink-mute normal-case tracking-normal">
                  {ch.whatsapp.sub}
                </div>
              </div>
            </div>
          </a>

          <a
            href={`mailto:${ch.email.value}`}
            className="block bg-white border border-line rounded-bartal p-4 mb-3 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start gap-3.5">
              <div
                className="w-[42px] h-[42px] rounded-full bg-navy flex items-center justify-center shrink-0 text-white"
                style={{ fontSize: 18 }}
                aria-hidden
              >
                ✉
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-small font-bold text-ink mb-1">
                  {ch.email.title}
                </div>
                <div
                  className="text-amber font-mono font-semibold mb-1 normal-case tracking-normal truncate"
                  dir="ltr"
                  style={{ fontSize: 15 }}
                >
                  {ch.email.value}
                </div>
                <div className="text-[11px] text-ink-mute normal-case tracking-normal">
                  {ch.email.sub}
                </div>
              </div>
            </div>
          </a>

          <a
            href={`tel:${ch.phone.value.replace(/\s/g, '')}`}
            className="block bg-white border border-line rounded-bartal p-4 mb-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start gap-3.5">
              <div
                className="w-[42px] h-[42px] rounded-full bg-amber flex items-center justify-center shrink-0 text-white"
                style={{ fontSize: 18 }}
                aria-hidden
              >
                ☏
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-small font-bold text-ink mb-1">
                  {ch.phone.title}
                </div>
                <div
                  className="text-amber font-mono font-semibold mb-1 normal-case tracking-normal truncate"
                  dir="ltr"
                  style={{ fontSize: 15 }}
                >
                  {ch.phone.value}
                </div>
                <div className="text-[11px] text-ink-mute normal-case tracking-normal">
                  {ch.phone.sub}
                </div>
              </div>
            </div>
          </a>

          <div className="bg-white border border-line rounded-bartal p-4">
            <div className="text-[11px] text-ink-mute uppercase tracking-wider font-semibold mb-2.5">
              {ch.office.heading}
            </div>
            <div className="text-body text-ink font-medium leading-relaxed">
              {ch.office.lines.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </WebStaticShell>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: `${dict.web.contact.eyebrow} · ${dict.web.contact.title}`,
    description: dict.web.contact.subtitle,
  };
}
