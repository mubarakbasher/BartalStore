'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';

export function OfflineBanner({ locale }: { locale: Locale }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="bg-danger text-white px-6 py-2 text-small text-center">
      {locale === 'ar' ? 'أنت غير متصل بالإنترنت — بعض الميزات لن تعمل' : "You're offline — some features won't work"}
    </div>
  );
}
