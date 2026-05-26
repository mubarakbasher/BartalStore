import { Link } from 'react-router-dom';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { usePrefsStore } from '@/lib/state/prefs-store';

export function TeamTab() {
  const locale = usePrefsStore((s) => s.locale);

  return (
    <AdmCard>
      <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
        {locale === 'ar' ? 'الفريق والصلاحيات' : 'Team & permissions'}
      </div>
      <div className="text-small text-ink-mute dark:text-d-textMute mb-4 leading-relaxed">
        {locale === 'ar'
          ? 'إدارة الموظفين موجودة في صفحة الموظفين المستقلة. هذه الصفحة تختصر الوصول إليها مباشرة.'
          : 'Staff management lives on its own page. Use the link below to open it directly.'}
      </div>
      <Link to="/staff" className="inline-block">
        <AdmButton variant="primary">
          {locale === 'ar' ? 'فتح إدارة الموظفين ←' : 'Open staff management →'}
        </AdmButton>
      </Link>
    </AdmCard>
  );
}
