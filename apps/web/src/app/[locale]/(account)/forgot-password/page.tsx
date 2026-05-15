import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AuthCard } from '@/components/AuthCard';

interface PageProps {
  params: { locale: string };
}

export default function ForgotPasswordPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <AuthCard
      locale={locale}
      title={dict.web.auth.forgot}
      subtitle={
        locale === 'ar'
          ? 'أدخل رقم هاتفك وسنرسل لك رمزاً عبر SMS.'
          : 'Enter your phone number and we will send a code by SMS.'
      }
      fields={[{ name: 'phone', label: dict.web.auth.phone, type: 'tel', placeholder: '+249 9XX XXX XXX' }]}
      submitLabel={locale === 'ar' ? 'إرسال الرمز' : 'Send code'}
      comingSoonNotice={dict.web.auth.comingSoon}
    />
  );
}
