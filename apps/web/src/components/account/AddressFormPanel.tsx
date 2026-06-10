'use client';
import { useState, useTransition } from 'react';
import { KHARTOUM_DELIVERY_ZONES } from '@bartal/shared';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { CreateAddressDto } from '@/lib/api/types';
import type { Address } from '@bartal/shared';
import { useAddresses } from '@/lib/state/addresses-store';

interface Props {
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
  /** Called with the created address on success, before onClose. */
  onCreated?: (address: Address) => void;
}

const LABEL_OPTIONS: Array<{ value: string; ar: string; en: string }> = [
  { value: 'home', ar: 'المنزل', en: 'Home' },
  { value: 'work', ar: 'العمل', en: 'Work' },
  { value: 'parents', ar: 'الأهل', en: 'Parents' },
  { value: 'other', ar: 'أخرى', en: 'Other' },
];

export function AddressFormPanel({ locale, dict, onClose, onCreated }: Props) {
  const isAr = locale === 'ar';
  const create = useAddresses((s) => s.create);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateAddressDto>({
    label: 'home',
    full_name: '',
    phone: '',
    district: '',
    landmark: '',
    zone: 'ZONE_A',
    is_default: false,
  });

  const set = <K extends keyof CreateAddressDto>(key: K, value: CreateAddressDto[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = () => {
    setError(null);
    if (form.full_name.trim().length < 2) {
      setError(isAr ? 'الاسم مطلوب.' : 'Full name is required.');
      return;
    }
    if (!/^\+249\d{9}$/.test(form.phone.trim())) {
      setError(isAr ? 'رقم الهاتف يجب أن يكون بصيغة +249XXXXXXXXX.' : 'Phone must be +249 followed by 9 digits.');
      return;
    }
    if (form.district.trim().length < 2) {
      setError(isAr ? 'الحي / المنطقة مطلوب.' : 'District is required.');
      return;
    }
    if (form.landmark.trim().length < 3) {
      setError(isAr ? 'العلامة المميزة مطلوبة (لا يوجد رمز بريدي في السودان).' : 'Landmark is required (Sudan has no postal codes).');
      return;
    }
    startTransition(async () => {
      const res = await create(
        {
          ...form,
          secondary_phone: form.secondary_phone || undefined,
          street: form.street || undefined,
          delivery_notes: form.delivery_notes || undefined,
        },
        locale,
      );
      if (res.ok) {
        onCreated?.(res.data);
        onClose();
      } else {
        setError(isAr ? res.error.message_ar : res.error.message_en);
      }
    });
  };

  const inputCls =
    'w-full h-10 px-3 bg-sand border border-line rounded-bartal text-small text-ink focus:outline-none focus:border-amber focus:bg-white transition-colors';
  const labelCls = 'text-[11px] font-bold text-ink-mute uppercase tracking-wider mb-1 block';
  const req = <span className="text-danger"> *</span>;

  return (
    <div className="bg-white border border-amber rounded-bartal p-4 space-y-3">
      <div className="text-[15px] font-bold text-ink">
        {isAr ? 'إضافة عنوان جديد' : 'Add a new address'}
      </div>

      {error && (
        <div className="text-[12px] text-danger bg-danger/10 rounded-bartal px-3 py-2">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className={labelCls}>{isAr ? 'التسمية' : 'Label'}</span>
          <select className={inputCls} value={form.label} onChange={(e) => set('label', e.target.value)}>
            {LABEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {isAr ? o.ar : o.en}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>{isAr ? 'الاسم الكامل' : 'Full name'}{req}</span>
          <input className={inputCls} value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
        </label>
        <label className="block">
          <span className={labelCls}>{isAr ? 'رقم الهاتف' : 'Phone'}{req}</span>
          <input className={`${inputCls} font-mono`} dir="ltr" placeholder="+249XXXXXXXXX" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </label>
        <label className="block">
          <span className={labelCls}>{isAr ? 'هاتف بديل (اختياري)' : 'Secondary phone (optional)'}</span>
          <input className={`${inputCls} font-mono`} dir="ltr" placeholder="+249XXXXXXXXX" value={form.secondary_phone ?? ''} onChange={(e) => set('secondary_phone', e.target.value)} />
        </label>
        <label className="block">
          <span className={labelCls}>{isAr ? 'المنطقة (الزون)' : 'Delivery zone'}{req}</span>
          <select className={inputCls} value={form.zone} onChange={(e) => set('zone', e.target.value as CreateAddressDto['zone'])}>
            {KHARTOUM_DELIVERY_ZONES.map((z) => (
              <option key={z.zone} value={z.zone}>
                {isAr ? z.name_ar : z.name_en}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>{isAr ? 'الحي / المنطقة' : 'District'}{req}</span>
          <input className={inputCls} value={form.district} onChange={(e) => set('district', e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>{isAr ? 'الشارع (اختياري)' : 'Street (optional)'}</span>
          <input className={inputCls} value={form.street ?? ''} onChange={(e) => set('street', e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>{isAr ? 'العلامة المميزة' : 'Landmark'}{req}</span>
          <input
            className={inputCls}
            placeholder={isAr ? 'مثال: بجانب مسجد النور' : 'e.g. Next to Al-Nur Mosque'}
            value={form.landmark}
            onChange={(e) => set('landmark', e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>{isAr ? 'ملاحظات التوصيل (اختياري)' : 'Delivery notes (optional)'}</span>
          <input className={inputCls} value={form.delivery_notes ?? ''} onChange={(e) => set('delivery_notes', e.target.value)} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-small text-ink">
        <input
          type="checkbox"
          checked={!!form.is_default}
          onChange={(e) => set('is_default', e.target.checked)}
        />
        {isAr ? 'تعيين كعنوان افتراضي' : 'Set as default address'}
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep transition-colors disabled:opacity-60"
        >
          {dict.web.account.addressesSection.addButton}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-transparent text-navy border border-line rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-sand transition-colors"
        >
          {isAr ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
