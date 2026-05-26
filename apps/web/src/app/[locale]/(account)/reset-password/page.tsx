import { notFound, redirect } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { ResetPasswordForm } from './ResetPasswordForm';

interface PageProps {
  params: { locale: string };
  searchParams: { phone?: string; code?: string };
}

export default function ResetPasswordPage({ params, searchParams }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const phone = (searchParams.phone ?? '').trim();
  const code = (searchParams.code ?? '').trim();
  if (!phone || !code) redirect(`/${locale}/forgot-password`);
  const dict = getDictionary(locale);
  return <ResetPasswordForm locale={locale} phone={phone} code={code} dict={dict} />;
}
