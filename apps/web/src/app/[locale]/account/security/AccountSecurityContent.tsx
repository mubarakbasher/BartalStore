'use client';
import { useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { ToggleRow } from '@/components/account/ToggleRow';
import { SessionRow } from '@/components/account/SessionRow';
import { changePasswordAction } from '@/lib/account/actions';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function AccountSecurityContent({ locale, dict }: Props) {
  const t = dict.web.account.securitySection;
  const [twoFa, setTwoFa] = useState({ sms: true, authy: false, whatsapp: true });
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const submitPassword = () => {
    setMsg(null);
    if (next.length < 8) {
      setMsg({ kind: 'err', text: locale === 'ar' ? 'كلمة المرور قصيرة جدًا (٨ أحرف على الأقل).' : 'Password too short (min 8 characters).' });
      return;
    }
    if (next !== confirm) {
      setMsg({ kind: 'err', text: locale === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.' });
      return;
    }
    startTransition(async () => {
      const res = await changePasswordAction({ currentPassword: current, newPassword: next }, locale);
      if (res.ok) {
        setCurrent('');
        setNext('');
        setConfirm('');
        setMsg({ kind: 'ok', text: locale === 'ar' ? 'تم تحديث كلمة المرور.' : 'Password updated.' });
      } else {
        setMsg({ kind: 'err', text: locale === 'ar' ? res.error.message_ar : res.error.message_en });
      }
    });
  };

  const passwordField = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="bg-sand border border-line rounded-bartal px-3.5 py-2.5">
      <div className="text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1">
        {label}
      </div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        className="w-full bg-transparent border-none outline-none text-small text-ink font-mono p-0"
      />
    </div>
  );

  return (
    <div className="space-y-3.5">
      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="p-4 border-b border-line text-[15px] font-bold text-ink">
          {t.password.title}
        </div>
        <div className="p-4">
          <p className="text-small text-ink-mute leading-relaxed mb-3.5">
            {t.password.intro}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
            <div className="sm:col-span-2">{passwordField(t.password.current, current, setCurrent)}</div>
            {passwordField(t.password.next, next, setNext)}
            {passwordField(t.password.confirm, confirm, setConfirm)}
          </div>
          {msg && (
            <div
              className={`mb-3 text-[12px] font-semibold ${
                msg.kind === 'ok' ? 'text-ok' : 'text-danger'
              }`}
            >
              {msg.text}
            </div>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={submitPassword}
            className="bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep transition-colors disabled:opacity-60"
          >
            {t.password.update}
          </button>
        </div>
      </div>

      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="p-4 border-b border-line text-[15px] font-bold text-ink">
          {t.twoFa.title}
        </div>
        <div className="px-4">
          {(
            [
              { k: 'sms' as const, label: t.twoFa.rows.sms, sub: t.twoFa.rows.smsSub },
              { k: 'authy' as const, label: t.twoFa.rows.authy, sub: t.twoFa.rows.authySub },
              { k: 'whatsapp' as const, label: t.twoFa.rows.whatsapp, sub: t.twoFa.rows.whatsappSub },
            ]
          ).map((row) => (
            <ToggleRow
              key={row.k}
              label={row.label}
              sub={row.sub}
              on={twoFa[row.k]}
              onToggle={() => setTwoFa((v) => ({ ...v, [row.k]: !v[row.k] }))}
              statusPill={{
                label: twoFa[row.k] ? t.twoFa.on : t.twoFa.off,
                on: twoFa[row.k],
              }}
              action={{
                label: twoFa[row.k] ? t.twoFa.manage : t.twoFa.enable,
                onClick: () => setTwoFa((v) => ({ ...v, [row.k]: !v[row.k] })),
              }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="p-4 border-b border-line text-[15px] font-bold text-ink">
          {t.sessions.title}
        </div>
        {t.sessions.items.map((s) => (
          <SessionRow
            key={s.device}
            device={s.device}
            loc={s.loc}
            when={s.when}
            current={s.current}
            thisDeviceLabel={t.sessions.thisDevice}
            signOutLabel={t.sessions.signOut}
          />
        ))}
      </div>
    </div>
  );
}
