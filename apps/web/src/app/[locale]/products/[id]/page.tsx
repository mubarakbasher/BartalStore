import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary, tt } from '@/lib/i18n/dictionary';
import { apiGet, ApiClientError } from '@/lib/api/client';
import type { Product } from '@/lib/api/types';
import { ProductPlaceholder, hueForProduct } from '@/components/ProductPlaceholder';
import { PriceTag } from '@/components/PriceTag';
import { StatusBadge } from '@/components/StatusBadge';
import { AddToCartControls } from '@/components/AddToCartControls';
import { TruckIcon, WhatsappIcon } from '@/components/Icons';
import { bilingualAlternates } from '@/lib/seo/site';
import { BARTAL } from '@/design/tokens';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  try {
    const product = await apiGet<Product>(`products/${params.id}`, {}, locale);
    const name = locale === 'ar' ? product.name_ar : product.name_en;
    const description = (locale === 'ar' ? product.description_ar : product.description_en) ?? '';
    const trimmed = description.length > 160 ? `${description.slice(0, 157)}…` : description;
    const primary = product.images.find((i) => i.is_primary) ?? product.images[0];
    return {
      title: name,
      description: trimmed || (locale === 'ar' ? 'منتج من برتال' : 'A Bartal product'),
      alternates: bilingualAlternates(`/products/${product.slug || product.id}`),
      openGraph: {
        title: name,
        description: trimmed,
        type: 'website',
        images: primary
          ? [{ url: primary.url, alt: (locale === 'ar' ? primary.alt_ar : primary.alt_en) ?? name }]
          : [{ url: '/opengraph-image' }],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  let product: Product | null = null;
  try {
    product = await apiGet<Product>(`products/${params.id}`, {}, locale);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) notFound();
    throw err;
  }
  if (!product) notFound();

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const lowStock = product.stock > 0 && product.stock <= product.low_stock_threshold;
  const status = product.stock === 0 ? 'OUT_OF_STOCK' : lowStock ? 'LOW_STOCK' : 'IN_STOCK';
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const hue = hueForProduct(product.slug);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT ?? '+249912345678';
  const whatsappMessage =
    locale === 'ar'
      ? `مرحباً، عندي سؤال عن المنتج: ${name}`
      : `Hi, I have a question about: ${name}`;

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-micro text-ink-mute flex items-center gap-2 mb-4 normal-case tracking-normal">
        <Link href={`/${locale}`} className="hover:text-ink">{dict.web.nav.home}</Link>
        <span>{locale === 'ar' ? '◂' : '▸'}</span>
        <Link href={`/${locale}/products`} className="hover:text-ink">{locale === 'ar' ? 'المتجر' : 'Shop'}</Link>
        <span>{locale === 'ar' ? '◂' : '▸'}</span>
        <Link
          href={`/${locale}/categories/${product.category.slug}`}
          className="hover:text-ink"
        >
          {locale === 'ar' ? product.category.name_ar : product.category.name_en}
        </Link>
      </nav>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          <div className="aspect-square bg-sand rounded-bartal-lg overflow-hidden border border-line">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              (<img
                src={primaryImage.url}
                alt={(locale === 'ar' ? primaryImage.alt_ar : primaryImage.alt_en) ?? name}
                className="w-full h-full object-cover"
              />)
            ) : (
              <ProductPlaceholder label={product.name_en} hue={hue} />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {product.images.slice(0, 5).map((img) => (
                <div
                  key={img.id}
                  className="aspect-square bg-sand rounded-bartal overflow-hidden border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-micro font-semibold text-ink-mute uppercase tracking-wider">
              {locale === 'ar' ? product.category.name_ar : product.category.name_en}
            </span>
            {product.is_featured && <StatusBadge status="FEATURED" locale={locale} />}
            <StatusBadge status={status} locale={locale} />
          </div>

          <h1 className="text-h1 font-bold text-ink mb-2">{name}</h1>
          <div className="text-small text-ink-mute mb-5 leading-relaxed normal-case tracking-normal">
            {description}
          </div>

          <div className="bg-white border border-line rounded-bartal-lg p-5 mb-5">
            <div className="flex items-baseline gap-3 mb-1">
              <PriceTag
                amount={Number(product.price)}
                locale={locale}
                size={26}
                color={BARTAL.amber}
                compare={product.compare_price ? Number(product.compare_price) : null}
              />
            </div>
            {lowStock && (
              <div className="text-small text-amber font-semibold mt-2">
                {tt(dict.web.product.lowStock, { count: product.stock })}
              </div>
            )}

            <AddToCartControls product={product} locale={locale} dict={dict} />
          </div>

          {/* Delivery / trust strip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sand rounded-bartal p-4 flex gap-3">
              <div className="text-amber shrink-0">
                <TruckIcon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-small font-bold text-ink">
                  {locale === 'ar' ? 'توصيل سريع' : 'Fast delivery'}
                </div>
                <div className="text-micro text-ink-mute mt-0.5 normal-case tracking-normal">
                  {locale === 'ar' ? 'الخرطوم خلال ١–٢ أيام' : '1–2 days in Khartoum'}
                </div>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                whatsappMessage,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-sand rounded-bartal p-4 flex gap-3 hover:bg-amber-tint transition-colors"
            >
              <div className="text-amber shrink-0">
                <WhatsappIcon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-small font-bold text-ink">
                  {locale === 'ar' ? 'لديك سؤال؟' : 'Have a question?'}
                </div>
                <div className="text-micro text-amber font-semibold mt-0.5 normal-case tracking-normal">
                  {locale === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                </div>
              </div>
            </a>
          </div>

          {/* SKU + meta */}
          <div className="mt-5 pt-5 border-t border-line text-micro text-ink-mute space-y-1 normal-case tracking-normal">
            {product.sku && (
              <div>
                <span className="font-semibold">{dict.web.product.sku}:</span>{' '}
                <span className="font-mono">{product.sku}</span>
              </div>
            )}
            <div>
              <span className="font-semibold">{dict.web.product.brand}:</span> Bartal
            </div>
          </div>
        </div>
      </div>
      {/* Description block */}
      <section className="mt-12">
        <h2 className="text-h2 font-bold text-ink mb-3">{dict.web.product.description}</h2>
        <div className="bg-white border border-line rounded-bartal-lg p-6 text-body text-ink leading-relaxed">
          {description}
        </div>
      </section>
    </div>
  );
}
