import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmTextarea } from '@/components/primitives/AdmTextarea';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { pushToast } from '@/components/primitives/toast-bus';
import { ImageManager } from './ImageManager';
import { useAdminCategories, useAdminProduct } from '@/lib/api/queries';
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  type CreateProductBody,
} from '@/lib/api/mutations';
import { ApiClientError } from '@/lib/api/client';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

const schema = z.object({
  name_ar: z.string().min(1, 'REQUIRED'),
  name_en: z.string().min(1, 'REQUIRED'),
  description_ar: z.string().min(1, 'REQUIRED'),
  description_en: z.string().min(1, 'REQUIRED'),
  slug: z.string().min(1, 'REQUIRED'),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, 'NON_NEGATIVE'),
  compare_price: z.coerce.number().optional().or(z.literal('').transform(() => undefined)),
  stock: z.coerce.number().int().min(0, 'NON_NEGATIVE'),
  category_id: z.string().min(1, 'REQUIRED'),
  weight_grams: z.coerce.number().int().min(0).optional().or(z.literal('').transform(() => undefined)),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(isEdit ? dict.productForm.editTitle : dict.productForm.createTitle);
  const navigate = useNavigate();

  const { data: product, isLoading } = useAdminProduct(id);
  const { data: categories = [] } = useAdminCategories();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      slug: '',
      sku: '',
      price: 0,
      stock: 0,
      category_id: '',
      is_active: true,
      is_featured: false,
    },
  });

  useEffect(() => {
    if (!product) return;
    reset({
      name_ar: product.name_ar,
      name_en: product.name_en,
      description_ar: product.description_ar,
      description_en: product.description_en,
      slug: product.slug,
      sku: product.sku ?? '',
      price: product.price,
      compare_price: product.compare_price ?? undefined,
      stock: product.stock,
      category_id: product.category_id,
      weight_grams: product.weight_grams ?? undefined,
      is_active: product.is_active,
      is_featured: product.is_featured,
    });
  }, [product, reset]);

  const create = useCreateProduct();
  const update = useUpdateProduct(id ?? '');
  const softDelete = useDeleteProduct(id ?? '');
  const [slugAuto, setSlugAuto] = useState(!isEdit);

  const nameEn = watch('name_en');
  useEffect(() => {
    if (slugAuto && nameEn) {
      setValue('slug', slugify(nameEn), { shouldDirty: true });
    }
  }, [slugAuto, nameEn, setValue]);

  const submit = async (values: FormValues) => {
    const payload: CreateProductBody = {
      name_ar: values.name_ar,
      name_en: values.name_en,
      description_ar: values.description_ar,
      description_en: values.description_en,
      slug: values.slug,
      price: values.price,
      stock: values.stock,
      category_id: values.category_id,
      is_active: values.is_active,
      is_featured: values.is_featured,
    };
    if (values.sku) payload.sku = values.sku;
    if (values.compare_price !== undefined && values.compare_price !== null) {
      payload.compare_price = values.compare_price;
    }
    if (values.weight_grams !== undefined && values.weight_grams !== null) {
      payload.weight_grams = values.weight_grams;
    }
    try {
      if (isEdit) {
        await update.mutateAsync(payload);
        pushToast('success', dict.productForm.saved);
      } else {
        const created = await create.mutateAsync(payload);
        pushToast('success', dict.productForm.saved);
        navigate(`/products/${created.id}/edit`, { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  const onSoftDelete = async () => {
    if (!id || !product) return;
    if (!window.confirm(dict.productForm.softDeleteConfirm)) return;
    try {
      await softDelete.mutateAsync();
      pushToast('success', dict.productForm.softDeleted);
      navigate('/products');
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  const validationMessage = (code: string | undefined): string | null => {
    if (!code) return null;
    if (code === 'REQUIRED') return dict.productForm.validation.required;
    if (code === 'NON_NEGATIVE') return dict.productForm.validation.priceNonNegative;
    return code;
  };

  // Indent categories by depth for the dropdown
  const orderedCategories = useMemo(() => {
    const childrenByParent = new Map<string | null, typeof categories>();
    for (const c of categories) {
      const list = childrenByParent.get(c.parent_id) ?? [];
      list.push(c);
      childrenByParent.set(c.parent_id, list);
    }
    const flat: Array<{ id: string; label: string; depth: number }> = [];
    const walk = (parent: string | null, depth: number) => {
      for (const c of childrenByParent.get(parent) ?? []) {
        flat.push({
          id: c.id,
          label: `${'— '.repeat(depth)}${locale === 'ar' ? c.name_ar : c.name_en}`,
          depth,
        });
        walk(c.id, depth + 1);
      }
    };
    walk(null, 0);
    return flat;
  }, [categories, locale]);

  if (isEdit && isLoading && !product) {
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }
  if (isEdit && !isLoading && !product) {
    return <AdmEmptyState title={dict.common.error} />;
  }

  const isPending = isSubmitting || create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/products"
          className="text-small font-semibold text-ink-mute dark:text-d-textMute hover:text-ink"
        >
          {dict.productForm.backToList}
        </Link>
        <div className="flex items-center gap-2">
          {isEdit && product?.is_active && (
            <AdmButton
              type="button"
              variant="danger"
              onClick={onSoftDelete}
              disabled={softDelete.isPending}
            >
              {dict.productForm.softDelete}
            </AdmButton>
          )}
          <AdmButton type="submit" disabled={isPending}>
            {isPending
              ? isEdit
                ? dict.productForm.saving
                : dict.productForm.creating
              : isEdit
                ? dict.productForm.save
                : dict.productForm.create}
          </AdmButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
              {dict.productForm.sections.details}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="name_ar" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.nameAr}
                </label>
                <AdmInput id="name_ar" dir="rtl" {...register('name_ar')} invalid={Boolean(errors.name_ar)} />
                {errors.name_ar && (
                  <div className="text-small text-danger mt-1">{validationMessage(errors.name_ar.message)}</div>
                )}
              </div>
              <div>
                <label htmlFor="name_en" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.nameEn}
                </label>
                <AdmInput id="name_en" dir="ltr" {...register('name_en')} invalid={Boolean(errors.name_en)} />
                {errors.name_en && (
                  <div className="text-small text-danger mt-1">{validationMessage(errors.name_en.message)}</div>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="slug" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.slug}
                </label>
                <div className="flex items-center gap-2">
                  <AdmInput
                    id="slug"
                    dir="ltr"
                    {...register('slug')}
                    invalid={Boolean(errors.slug)}
                    onChange={(e) => {
                      setSlugAuto(false);
                      register('slug').onChange(e);
                    }}
                  />
                </div>
                <div className="text-micro text-ink-mute dark:text-d-textMute mt-1">
                  {dict.productForm.fields.slugHint}
                </div>
              </div>
              <div>
                <label htmlFor="sku" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.sku}
                </label>
                <AdmInput id="sku" dir="ltr" {...register('sku')} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="description_ar" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.descriptionAr}
                </label>
                <AdmTextarea id="description_ar" dir="rtl" {...register('description_ar')} invalid={Boolean(errors.description_ar)} />
              </div>
              <div>
                <label htmlFor="description_en" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.descriptionEn}
                </label>
                <AdmTextarea id="description_en" dir="ltr" {...register('description_en')} invalid={Boolean(errors.description_en)} />
              </div>
            </div>
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
              {dict.productForm.sections.media}
            </div>
            <ImageManager productId={isEdit ? (id ?? null) : null} images={product?.images ?? []} />
          </AdmCard>
        </div>

        <div className="space-y-4">
          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
              {dict.productForm.sections.status}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-small text-ink dark:text-d-text">
                <input type="checkbox" {...register('is_active')} />
                <span>{dict.productForm.fields.isActive}</span>
              </label>
              <label className="flex items-center gap-2 text-small text-ink dark:text-d-text">
                <input type="checkbox" {...register('is_featured')} />
                <span>{dict.productForm.fields.isFeatured}</span>
              </label>
            </div>
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
              {dict.productForm.sections.pricing}
            </div>
            <div className="space-y-3">
              <div>
                <label htmlFor="price" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.price}
                </label>
                <AdmInput id="price" type="number" min={0} step="0.01" {...register('price')} invalid={Boolean(errors.price)} />
                {errors.price && (
                  <div className="text-small text-danger mt-1">{validationMessage(errors.price.message)}</div>
                )}
              </div>
              <div>
                <label htmlFor="compare_price" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.comparePrice}
                </label>
                <AdmInput id="compare_price" type="number" min={0} step="0.01" {...register('compare_price')} />
              </div>
              <div>
                <label htmlFor="stock" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {locale === 'ar' ? 'المخزون' : 'Stock'}
                </label>
                <AdmInput id="stock" type="number" min={0} step="1" {...register('stock')} invalid={Boolean(errors.stock)} />
                {errors.stock && (
                  <div className="text-small text-danger mt-1">{validationMessage(errors.stock.message)}</div>
                )}
              </div>
              <div>
                <label htmlFor="weight_grams" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                  {dict.productForm.fields.weightGrams}
                </label>
                <AdmInput id="weight_grams" type="number" min={0} step="1" {...register('weight_grams')} />
              </div>
            </div>
          </AdmCard>

          <AdmCard>
            <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
              {dict.productForm.sections.organization}
            </div>
            <label htmlFor="category_id" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
              {dict.productForm.fields.category}
            </label>
            <AdmSelect id="category_id" {...register('category_id')} invalid={Boolean(errors.category_id)}>
              <option value="">{dict.common.none}</option>
              {orderedCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </AdmSelect>
            {errors.category_id && (
              <div className="text-small text-danger mt-1">{validationMessage(errors.category_id.message)}</div>
            )}
          </AdmCard>
        </div>
      </div>
    </form>
  );
}
