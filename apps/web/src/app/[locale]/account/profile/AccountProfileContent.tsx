'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useAccount } from '@/lib/state/account-store';
import { VerificationRow } from '@/components/account/VerificationRow';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

function formatDob(iso: string | undefined, locale: Locale): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function AccountProfileContent({ locale, dict }: Props) {
  const user = useAccount((s) => s.user);
  const t = dict.web.account.profileSection;
  const [editing, setEditing] = useState(false);

  const fields: Array<{ label: string; value: string; mono?: boolean }> = [
    { label: t.fields.firstName, value: user.firstName },
    { label: t.fields.lastName, value: user.lastName },
    { label: t.fields.phone, value: user.phone, mono: true },
    { label: t.fields.email, value: user.email },
    { label: t.fields.dob, value: formatDob(user.dob, locale) },
    {
      label: t.fields.gender,
      value:
        user.gender === 'male'
          ? t.fields.male
          : user.gender === 'female'
            ? t.fields.female
            : t.fields.other,
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="p-4 border-b border-line flex items-center gap-3">
          <div className="text-[16px] font-bold text-ink flex-1">{t.cardTitle}</div>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="bg-amber text-white rounded-bartal px-4 py-2 text-[12px] font-bold hover:opacity-90 transition-opacity"
          >
            {editing ? t.save : t.edit}
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.label} className="bg-white border border-line rounded-bartal p-3">
              <div className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1">
                {f.label}
              </div>
              <div
                className={`text-small text-ink font-medium ${f.mono ? 'font-mono' : ''}`}
                dir={f.mono ? 'ltr' : undefined}
              >
                {f.value}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VerificationRow
            label={t.verifications.phone}
            via={t.verifications.viaSms}
            state={user.verifications.phone}
            verifyLabel={t.verifications.verify}
          />
          <VerificationRow
            label={t.verifications.email}
            via={t.verifications.emailVia}
            state={user.verifications.email}
            verifyLabel={t.verifications.verify}
          />
          <VerificationRow
            label={t.verifications.nationalId}
            via={t.verifications.nationalRequired}
            state={user.verifications.nationalId}
            verifyLabel={t.verifications.verify}
          />
        </div>
      </div>

      <div className="bg-white border border-danger/20 rounded-bartal p-4">
        <div className="text-small font-bold text-danger mb-1">{t.danger.title}</div>
        <div className="text-[12px] text-ink-mute leading-relaxed mb-2.5">{t.danger.body}</div>
        <button
          type="button"
          className="bg-transparent text-danger border border-danger rounded-bartal px-4 py-2 text-[12px] font-bold hover:bg-danger/5 transition-colors"
        >
          {t.danger.button}
        </button>
      </div>
    </div>
  );
}
