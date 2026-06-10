import { notFound, redirect } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { OtpForm } from './OtpForm';
import type { OtpPurpose } from '@/lib/api/types';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string; purpose?: string }>;
}

function normalizePurpose(value: string | undefined): OtpPurpose {
  if (value === 'LOGIN' || value === 'RESET') return value;
  return 'REGISTER';
}

export default async function VerifyOtpPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const phone = (searchParams.phone ?? '').trim();
  if (!phone) redirect(`/${locale}/login`);
  const purpose = normalizePurpose(searchParams.purpose);
  return <OtpForm locale={locale} phone={phone} purpose={purpose} />;
}
