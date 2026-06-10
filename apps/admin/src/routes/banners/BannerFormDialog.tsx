import { useEffect, useRef, useState } from 'react';
import { AdmDialog } from '@/components/primitives/AdmDialog';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import {
  useCreateBanner,
  useUpdateBanner,
  useUploadBannerImage,
} from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/toast-bus';
import type { AdminLocale } from '@/lib/state/prefs-store';
import type { AdminBannerRow, BannerStatusValue } from '@/lib/api/types';

interface Props {
  open: boolean;
  onClose: () => void;
  locale: AdminLocale;
  editing: AdminBannerRow | null;
}

interface ApiError {
  response?: { data?: { error?: { message_en?: string; message_ar?: string } } };
  message?: string;
}

export function BannerFormDialog({ open, onClose, locale, editing }: Props) {
  const create = useCreateBanner();
  const update = useUpdateBanner(editing?.id ?? '');
  const upload = useUploadBannerImage();

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [status, setStatus] = useState<BannerStatusValue>('DRAFT');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setTitleAr(editing.title_ar);
      setTitleEn(editing.title_en);
      setImageUrl(editing.image_url);
      setCtaUrl(editing.cta_url ?? '');
      setStatus(editing.status);
    } else {
      setTitleAr('');
      setTitleEn('');
      setImageUrl('');
      setCtaUrl('');
      setStatus('DRAFT');
    }
    setPendingFile(null);
  }, [open, editing]);

  const onFilePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    // Live preview via ObjectURL
    setImageUrl(URL.createObjectURL(file));
  };

  const handleError = (err: unknown) => {
    const e = err as ApiError;
    const apiErr = e.response?.data?.error;
    const msg = apiErr
      ? locale === 'ar' ? apiErr.message_ar : apiErr.message_en
      : e.message ?? 'Error';
    pushToast('error', msg ?? 'Error');
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!titleAr.trim() || !titleEn.trim()) {
      pushToast('error', locale === 'ar' ? 'العنوانان مطلوبان' : 'Both titles required');
      return;
    }

    if (editing) {
      try {
        let finalImageUrl = imageUrl;
        if (pendingFile) {
          const res = await upload.mutateAsync({ bannerId: editing.id, file: pendingFile });
          finalImageUrl = res.url;
        }
        await update.mutateAsync({
          title_ar: titleAr.trim(),
          title_en: titleEn.trim(),
          image_url: finalImageUrl,
          cta_url: ctaUrl.trim() || undefined,
          status,
        });
        pushToast('success', locale === 'ar' ? 'تم تحديث البانر' : 'Banner updated');
        onClose();
      } catch (err) {
        handleError(err);
      }
      return;
    }

    // Create flow — we need an image first. If user picked a file, upload to a
    // placeholder banner first by creating with a stub URL, then uploading.
    // Two-step create (matches the existing product create+image pattern).
    try {
      // Require either an existing URL or a picked file.
      if (!pendingFile && !imageUrl) {
        pushToast(
          'error',
          locale === 'ar' ? 'الرجاء اختيار صورة' : 'Please pick an image',
        );
        return;
      }
      const created = await create.mutateAsync({
        title_ar: titleAr.trim(),
        title_en: titleEn.trim(),
        image_url: imageUrl || 'pending://upload',
        cta_url: ctaUrl.trim() || undefined,
        status,
      });
      if (pendingFile) {
        await upload.mutateAsync({ bannerId: created.id, file: pendingFile });
      }
      pushToast('success', locale === 'ar' ? 'تم إنشاء البانر' : 'Banner created');
      onClose();
    } catch (err) {
      handleError(err);
    }
  };

  const pending = create.isPending || update.isPending || upload.isPending;

  return (
    <AdmDialog
      open={open}
      onClose={onClose}
      size="lg"
      title={
        editing
          ? locale === 'ar' ? 'تعديل بانر' : 'Edit banner'
          : locale === 'ar' ? 'إضافة بانر' : 'Add banner'
      }
    >
      <form onSubmit={submit} className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'العنوان (عربي)' : 'Title (AR)'}
            </label>
            <AdmInput dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} required />
          </div>
          <div>
            <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
              {locale === 'ar' ? 'العنوان (إنجليزي)' : 'Title (EN)'}
            </label>
            <AdmInput value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'رابط الإجراء' : 'CTA URL'}
          </label>
          <AdmInput
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="/c/fragrance"
          />
        </div>

        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'الحالة' : 'Status'}
          </label>
          <AdmSelect value={status} onChange={(e) => setStatus(e.target.value as BannerStatusValue)}>
            <option value="DRAFT">{locale === 'ar' ? 'مسودة' : 'Draft'}</option>
            <option value="LIVE">{locale === 'ar' ? 'منشور' : 'Live'}</option>
          </AdmSelect>
        </div>

        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'الصورة' : 'Image'}
          </label>
          {imageUrl && (
            <div className="mb-2 inline-block border border-line dark:border-d-line rounded-bartal overflow-hidden">
              <img
                src={imageUrl}
                alt="banner preview"
                className="block w-[300px] h-[120px] object-cover"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFilePick}
            className="block text-small"
          />
          <div className="text-micro text-ink-mute dark:text-d-textMute mt-1">
            {locale === 'ar' ? 'JPG / PNG / WebP حتى ١٠ ميجابايت' : 'JPG / PNG / WebP up to 10MB'}
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
                : locale === 'ar' ? 'إنشاء البانر' : 'Create banner'}
          </AdmButton>
        </div>
      </form>
    </AdmDialog>
  );
}
