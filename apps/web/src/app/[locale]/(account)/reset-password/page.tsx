import { notFound, redirect } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { ResetPasswordForm } from './ResetPasswordForm';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string; code?: string }>;
}

export default async function ResetPasswordPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const phone = (searchParams.phone ?? '').trim();
  const code = (searchParams.code ?? '').trim();
  if (!phone || !code) redirect(`/${locale}/forgot-password`);
  const dict = getDictionary(locale);
  return <ResetPasswordForm locale={locale} phone={phone} code={code} dict={dict} />;
}
