import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AdmToaster } from '@/components/primitives/AdmToaster';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

export function AdminShell() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  return (
    <div className="min-h-screen flex bg-paper dark:bg-d-bg">
      <Sidebar dict={dict} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar dict={dict} />
        <main className="flex-1 p-6 min-w-0">
          <Outlet />
        </main>
      </div>
      <AdmToaster />
    </div>
  );
}
