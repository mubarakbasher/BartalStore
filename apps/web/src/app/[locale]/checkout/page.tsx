import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AppCard } from '@/components/AppCard';

interface PageProps {
  params: { locale: string };
}

export default function CheckoutPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const steps = [dict.web.checkout.step1, dict.web.checkout.step2, dict.web.checkout.step3];

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <h1 className="text-h1 font-bold text-ink mb-2">{dict.web.checkout.title}</h1>

      <div className="bg-amber-tint border border-amber/30 rounded-bartal p-3.5 mb-5 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-small text-ink font-semibold">
          {dict.web.checkout.newFlowBanner}
        </span>
        <Link
          href={`/${locale}/checkout/address`}
          className="inline-flex items-center justify-center h-9 px-4 bg-amber text-white rounded-bartal text-small font-bold hover:bg-[#B57208]"
        >
          {dict.web.checkout.newFlowCta}
        </Link>
      </div>

      {/* Step progress */}
      <ol className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-micro font-bold ${
                i === 0 ? 'bg-amber text-white' : 'bg-line text-ink-mute'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-small font-semibold ${i === 0 ? 'text-ink' : 'text-ink-mute'}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-line mx-2" />}
          </li>
        ))}
      </ol>

      <AppCard padding="lg">
        <div className="bg-amber-tint border border-amber/40 text-amber rounded-bartal px-4 py-3 text-small mb-6 leading-relaxed normal-case tracking-normal">
          {dict.web.checkout.comingSoon}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label={dict.web.auth.fullName} placeholder={locale === 'ar' ? 'فاطمة أحمد' : 'Fatima Ahmed'} />
          <Field label={dict.web.auth.phone} placeholder="+249 9XX XXX XXX" dir="ltr" />
          <Field label={locale === 'ar' ? 'الحي / المنطقة' : 'District'} placeholder={locale === 'ar' ? 'مثلاً: الرياض' : 'e.g. Al-Riyadh'} />
          <Field
            label={locale === 'ar' ? 'العلامة المميزة' : 'Nearest landmark'}
            placeholder={
              locale === 'ar'
                ? 'بجوار مسجد الفتح، البوابة الزرقاء'
                : 'Near Al-Fateh mosque, blue gate'
            }
            full
            required
          />
        </div>

        <div className="mt-6">
          <div className="text-small font-bold text-ink mb-2">
            {locale === 'ar' ? 'طريقة الدفع' : 'Payment method'}
          </div>
          <div className="space-y-2">
            <PaymentOption
              checked
              title={locale === 'ar' ? 'تحويل بنكي' : 'Bank transfer'}
              body={
                locale === 'ar'
                  ? 'حوّل المبلغ ثم ارفع صورة الإيصال — يتم التأكيد خلال ٢٤ ساعة.'
                  : 'Transfer then upload the receipt — confirmation within 24 hours.'
              }
            />
            <PaymentOption
              title={locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on delivery'}
              body={
                locale === 'ar'
                  ? 'ادفع نقداً عند وصول الطلب إلى عنوانك.'
                  : 'Pay in cash when the order arrives at your address.'
              }
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center justify-center h-11 px-5 border border-line text-ink rounded-bartal font-semibold hover:bg-sand"
          >
            {dict.web.cart.title}
          </Link>
          <button
            disabled
            className="inline-flex items-center justify-center h-11 px-5 bg-line text-ink-mute rounded-bartal font-bold cursor-not-allowed"
          >
            {dict.web.checkout.placeOrder}
          </button>
        </div>
      </AppCard>
    </div>
  );
}

function Field({
  label,
  placeholder,
  full,
  required,
  dir,
}: {
  label: string;
  placeholder: string;
  full?: boolean;
  required?: boolean;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-small font-semibold text-ink mb-1.5">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <input
        placeholder={placeholder}
        dir={dir}
        className="w-full h-11 px-3 bg-sand border border-line rounded-bartal text-body text-ink placeholder:text-ink-mute focus:outline-none focus:border-amber focus:bg-white transition-colors"
      />
    </div>
  );
}

function PaymentOption({ title, body, checked }: { title: string; body: string; checked?: boolean }) {
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-bartal border-2 cursor-pointer transition-colors ${
        checked ? 'border-amber bg-amber-tint' : 'border-line hover:border-amber/40'
      }`}
    >
      <input type="radio" name="payment" defaultChecked={checked} className="mt-1 accent-amber" />
      <div>
        <div className="text-small font-bold text-ink">{title}</div>
        <div className="text-micro text-ink-mute mt-0.5 leading-relaxed normal-case tracking-normal">{body}</div>
      </div>
    </label>
  );
}
