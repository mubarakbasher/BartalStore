import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebAccountLayout } from '@/components/account/WebAccountLayout';
import { getProfile } from '@/lib/account/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { UserProfile } from '@bartal/shared';
import { AccountProfileContent } from './AccountProfileContent';

interface PageProps {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default async function AccountProfilePage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  let profile: UserProfile | null = null;
  try {
    profile = await getProfile(locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return (
    <WebAccountLayout locale={locale} dict={dict} active="profile">
      <AccountProfileContent locale={locale} dict={dict} initialProfile={profile} />
    </WebAccountLayout>
  );
}
