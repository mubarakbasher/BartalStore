import { useEffect, useState } from 'react';
import { AdmDialog } from '@/components/primitives/AdmDialog';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmTextarea } from '@/components/primitives/AdmTextarea';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useCreatePromo, useUpdatePromo } from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/AdmToaster';
import type { AdminLocale } from '@/lib/state/prefs-store';
import type { AdminPromoRow, PromoType } from '@/lib/api/types';

interface Props {
  open: boolean;
  onClose: () => void;
  locale: AdminLocale;
  editing: AdminPromoRow | null;
}

interface ApiError {
  response?: { data?: { error?: { code?: string; message_en?: string; message_ar?: string } } };
  message?: string;
}

const TYPES: PromoType[] = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'];

export function PromoFormDialog({ open, onClose, locale, editing }: Props) {
  const create = useCreatePromo();
  const update = useUpdatePromo(editing?.id ?? '');

  const [code, setCode] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [type, setType] = useState<PromoType>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setCode(editing.code);
      setDescAr(editing.description_ar);
      setDescEn(editing.description_en);
      setType(editing.type);
      setValue(String(editing.value));
      setMaxUses(editing.max_uses?.toString() ?? '');
      setStartsAt(editing.starts_at?.slice(0, 10) ?? '');
      setExpiresAt(editing.expires_at?.slice(0, 10) ?? '');
    } else {
      setCode('');
      setDescAr('');
      setDescEn('');
      setType('PERCENTAGE');
      setValue('');
      setMaxUses('');
      setStartsAt('');
      setExpiresAt('');
    }
  }, [open, editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !/^[A-Za-z0-9_-]{3,32}$/.test(code.trim())) {
      pushToast(
        'error',
        locale === 'ar' ? 'الرمز غير صالح (٣-٣٢ حرفاً، A-Z, 0-9, _, -)' : 'Invalid code (3-32 chars: A-Z, 0-9, _, -)',
      );
      return;
    }
    if (startsAt && expiresAt && new Date(startsAt) >= new Date(expiresAt)) {
      pushToast(
        'error',
        locale === 'ar' ? 'تاريخ الانتهاء يجب أن يكون بعد البداية' : 'Expiry must be after start',
      );
      return;
    }

    const sharedBody = {
      description_ar: descAr.trim(),
      description_en: descEn.trim(),
      value: Number(value),
      max_uses: maxUses ? Number(maxUses) : undefined,
      starts_at: startsAt || undefined,
      expires_at: expiresAt || undefined,
    };

    const handleError = (err: unknown) => {
      const e = err as ApiError;
      const apiErr = e.response?.data?.error;
      const msg = apiErr
        ? locale === 'ar' ? apiErr.message_ar : apiErr.message_en
        : e.message ?? 'Error';
      pushToast('error', msg ?? 'Error');
    };

    if (editing) {
      update.mutate(sharedBody, {
        onSuccess: () => {
          pushToast(
            'success',
            locale === 'ar' ? `تم تحديث ${editing.code}` : `${editing.code} updated`,
          );
          onClose();
        },
        onError: handleError,
      });
    } else {
      create.mutate(
        { ...sharedBody, code: code.trim(), type },
        {
          onSuccess: (res) => {
            pushToast(
              'success',
              locale === 'ar' ? `تم إنشاء ${res.code}` : `${res.code} created`,
            );
            onClose();
          },
          onError: handleError,
        },
      );
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <AdmDialog
      open={open}
      onClose={onClose}
      size="md"
      title={
        editing
          ? locale === 'ar' ? 'تعديل رمز الخصم' : 'Edit promo code'
          : locale === 'ar' ? 'رمز خصم جديد' : 'New promo code'
      }
    >
      <form onSubmit={submit} className="p-5 space-y-4">
        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'الرمز' : 'Code'}
          </label>
          <AdmInput
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="RAMADAN15"
            disabled={!!editing}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'}
            </label>
            <AdmInput
              dir="rtl"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'الوصف (إنجليزي)' : 'Description (EN)'}
            </label>
            <AdmInput
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'النوع' : 'Type'}
            </label>
            <AdmSelect
              value={type}
              onChange={(e) => setType(e.target.value as PromoType)}
              disabled={!!editing}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </AdmSelect>
          </div>
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'القيمة' : 'Value'}
            </label>
            <AdmInput
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'الحد الأقصى للاستخدامات' : 'Max uses'}
            </label>
            <AdmInput
              type="number"
              min="1"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="∞"
            />
          </div>
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'يبدأ' : 'Starts at'}
            </label>
            <AdmInput
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'ينتهي' : 'Expires at'}
            </label>
            <AdmInput
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line dark:border-d-line">
          <AdmButton type="button" variant="ghost" onClick={onClose}>
            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
          </AdmButton>
          <AdmButton type="submit" variant="primary" disabled={pending}>
            {pending
              ? locale === 'ar' ? 'جارٍ الحفظ…' : 'Saving…'
              : editing
                ? locale === 'ar' ? 'حفظ التغييرات' : 'Save changes'
                : locale === 'ar' ? 'إنشاء' : 'Create'}
          </AdmButton>
        </div>
      </form>
    </AdmDialog>
  );
}
