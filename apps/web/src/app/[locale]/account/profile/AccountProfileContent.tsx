'use client';
import { useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { UserProfile } from '@bartal/shared';
import { VerificationRow } from '@/components/account/VerificationRow';
import { updateProfileAction } from '@/lib/account/actions';
import type { GenderValue } from '@/lib/api/types';

interface Props {
  locale: Locale;
  dict: Dictionary;
  initialProfile: UserProfile | null;
}

const EMPTY_PROFILE: UserProfile = {
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  memberSince: new Date().toISOString(),
  ordersCount: 0,
  lifetimeSpend: 0,
  loyaltyPoints: 0,
  verifications: { phone: 'unverified', email: 'unverified', nationalId: 'unverified' },
};

function formatDob(iso: string | undefined, locale: Locale): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function demoGenderToApi(g: UserProfile['gender']): GenderValue | undefined {
  if (g === 'male') return 'MALE';
  if (g === 'female') return 'FEMALE';
  if (g === 'other') return 'OTHER';
  return undefined;
}

export function AccountProfileContent({ locale, dict, initialProfile }: Props) {
  const t = dict.web.account.profileSection;
  const [user, setUser] = useState<UserProfile>(initialProfile ?? EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Draft fields (only the editable ones).
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [dob, setDob] = useState(user.dob ?? '');
  const [gender, setGender] = useState<UserProfile['gender']>(user.gender);

  const startEdit = () => {
    setError(null);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setDob(user.dob ?? '');
    setGender(user.gender);
    setEditing(true);
  };

  const save = () => {
    setError(null);
    startTransition(async () => {
      const name = `${firstName} ${lastName}`.trim();
      const res = await updateProfileAction(
        {
          name,
          email: email || undefined,
          date_of_birth: dob ? new Date(dob).toISOString() : null,
          gender: demoGenderToApi(gender),
        },
        locale,
      );
      if (res.ok) {
        setUser(res.data);
        setEditing(false);
      } else {
        setError(locale === 'ar' ? res.error.message_ar : res.error.message_en);
      }
    });
  };

  const readFields: Array<{ label: string; value: string; mono?: boolean }> = [
    { label: t.fields.firstName, value: user.firstName || '—' },
    { label: t.fields.lastName, value: user.lastName || '—' },
    { label: t.fields.phone, value: user.phone, mono: true },
    { label: t.fields.email, value: user.email || '—' },
    { label: t.fields.dob, value: formatDob(user.dob, locale) },
    {
      label: t.fields.gender,
      value:
        user.gender === 'male'
          ? t.fields.male
          : user.gender === 'female'
            ? t.fields.female
            : user.gender === 'other'
              ? t.fields.other
              : '—',
    },
  ];

  const inputCls =
    'w-full h-10 px-3 bg-sand border border-line rounded-bartal text-small text-ink focus:outline-none focus:border-amber focus:bg-white transition-colors';

  return (
    <div className="space-y-3.5">
      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="p-4 border-b border-line flex items-center gap-3">
          <div className="text-[16px] font-bold text-ink flex-1">{t.cardTitle}</div>
          <button
            type="button"
            disabled={pending}
            onClick={() => (editing ? save() : startEdit())}
            className="bg-amber text-white rounded-bartal px-4 py-2 text-[12px] font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {editing ? t.save : t.edit}
          </button>
        </div>

        {error && (
          <div className="px-4 py-2 bg-danger/10 text-danger text-[12px] border-b border-line">
            {error}
          </div>
        )}

        {editing ? (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block">
                {t.fields.firstName}
              </span>
              <input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block">
                {t.fields.lastName}
              </span>
              <input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block">
                {t.fields.phone}
              </span>
              <input className={`${inputCls} font-mono`} dir="ltr" value={user.phone} disabled />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block">
                {t.fields.email}
              </span>
              <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block">
                {t.fields.dob}
              </span>
              <input className={inputCls} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block">
                {t.fields.gender}
              </span>
              <select
                className={inputCls}
                value={gender ?? ''}
                onChange={(e) => setGender((e.target.value || undefined) as UserProfile['gender'])}
              >
                <option value="">—</option>
                <option value="male">{t.fields.male}</option>
                <option value="female">{t.fields.female}</option>
                <option value="other">{t.fields.other}</option>
              </select>
            </label>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {readFields.map((f) => (
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
        )}

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
