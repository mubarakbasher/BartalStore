'use client';
import { useRef, useState } from 'react';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmInput } from '@/components/primitives/AdmInput';
import { pushToast } from '@/components/primitives/AdmToaster';
import {
  useDeleteProductImage,
  useUpdateProductImage,
  useUploadProductImage,
} from '@/lib/api/mutations';
import { ApiClientError } from '@/lib/api/client';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { AdminProductImage } from '@/lib/api/types';

interface ImageManagerProps {
  productId: string | null;
  images: AdminProductImage[];
}

export function ImageManager({ productId, images }: ImageManagerProps) {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale).productForm.media;
  const upload = useUploadProductImage();
  const update = useUpdateProductImage(productId ?? '');
  const remove = useDeleteProductImage(productId ?? '');
  const fileInput = useRef<HTMLInputElement>(null);
  const [sortDrafts, setSortDrafts] = useState<Record<string, string>>({});

  const onUpload = async (file: File) => {
    if (!productId) return;
    try {
      await upload.mutateAsync({ productId, file, is_primary: images.length === 0 });
      pushToast('success', locale === 'ar' ? 'تم رفع الصورة' : 'Image uploaded');
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.uploading);
      }
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const onSetPrimary = async (imageId: string) => {
    try {
      await update.mutateAsync({ imageId, body: { is_primary: true } });
    } catch (err) {
      const msg =
        err instanceof ApiClientError
          ? locale === 'ar'
            ? err.message_ar
            : err.message_en
          : dict.uploading;
      pushToast('error', msg);
    }
  };

  const onSaveSort = async (imageId: string) => {
    const raw = sortDrafts[imageId];
    if (raw === undefined) return;
    const next = Number(raw);
    if (!Number.isFinite(next) || next < 0) return;
    try {
      await update.mutateAsync({ imageId, body: { sort_order: next } });
      setSortDrafts((d) => {
        const copy = { ...d };
        delete copy[imageId];
        return copy;
      });
    } catch (err) {
      const msg =
        err instanceof ApiClientError
          ? locale === 'ar'
            ? err.message_ar
            : err.message_en
          : dict.uploading;
      pushToast('error', msg);
    }
  };

  const onDelete = async (imageId: string) => {
    if (!window.confirm(dict.deleteConfirm)) return;
    try {
      await remove.mutateAsync(imageId);
      pushToast('success', locale === 'ar' ? 'تم حذف الصورة' : 'Image deleted');
    } catch (err) {
      const msg =
        err instanceof ApiClientError
          ? locale === 'ar'
            ? err.message_ar
            : err.message_en
          : dict.uploading;
      pushToast('error', msg);
    }
  };

  if (!productId) {
    return (
      <div className="text-small text-ink-mute dark:text-d-textMute">{dict.needsSave}</div>
    );
  }

  return (
    <div className="space-y-3">
      {images.length === 0 ? (
        <div className="text-small text-ink-mute dark:text-d-textMute">{dict.empty}</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => {
            const draft = sortDrafts[img.id];
            const sortValue = draft !== undefined ? draft : String(img.sort_order);
            return (
              <li
                key={img.id}
                className="border border-line dark:border-d-line rounded-bartal overflow-hidden bg-white dark:bg-d-surface"
              >
                <div className="aspect-square bg-sand dark:bg-d-raised overflow-hidden">
                  <img src={img.url} alt={img.alt_en ?? ''} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {img.is_primary ? (
                      <span className="text-micro font-mono uppercase text-amber bg-amber-tint px-1.5 py-0.5 rounded-full">
                        {dict.isPrimary}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="text-micro font-semibold text-amber hover:underline"
                        onClick={() => onSetPrimary(img.id)}
                        disabled={update.isPending}
                      >
                        {dict.setPrimary}
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-micro font-semibold text-danger hover:underline"
                      onClick={() => onDelete(img.id)}
                      disabled={remove.isPending}
                    >
                      {dict.delete}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="text-micro text-ink-mute dark:text-d-textMute">
                      {dict.sortOrder}
                    </label>
                    <AdmInput
                      className="h-8 px-2 text-small"
                      inputMode="numeric"
                      value={sortValue}
                      onChange={(e) => setSortDrafts((d) => ({ ...d, [img.id]: e.target.value }))}
                      onBlur={() => {
                        if (draft !== undefined && draft !== String(img.sort_order)) {
                          void onSaveSort(img.id);
                        }
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onUpload(file);
          }}
        />
        <AdmButton
          variant="ghost"
          size="sm"
          onClick={() => fileInput.current?.click()}
          disabled={upload.isPending}
        >
          {upload.isPending ? dict.uploading : dict.add}
        </AdmButton>
      </div>
    </div>
  );
}
