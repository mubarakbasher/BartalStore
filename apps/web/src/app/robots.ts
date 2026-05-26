import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*/account',
          '/*/account/*',
          '/*/orders',
          '/*/orders/*',
          '/*/wishlist',
          '/*/checkout',
          '/*/checkout/*',
          '/*/verify-otp',
          '/*/reset-password',
          '/*/design-system',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
