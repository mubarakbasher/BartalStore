import clsx from 'clsx';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useAdminAuditFeed, useAdminStaff } from '@/lib/api/queries';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { AdminAuditEntry, AdminStaffMember } from '@/lib/api/types';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

const ACTION_ACCENT: Record<string, string> = {
  REVIEW_APPROVED: 'bg-ok',
  REVIEW_REJECTED: 'bg-danger',
  REVIEW_RESET_TO_PENDING: 'bg-info',
  PAYMENT_CONFIRMED: 'bg-ok',
  PAYMENT_REJECTED: 'bg-danger',
  STATUS_CHANGE: 'bg-info',
  CREATE: 'bg-amber',
  UPDATE: 'bg-info',
  SOFT_DELETE: 'bg-danger',
  IMAGE_UPLOAD: 'bg-amber',
  IMAGE_UPDATE: 'bg-info',
  IMAGE_DELETE: 'bg-danger',
  SETTINGS_UPDATE: 'bg-amber',
  ZONE_FEE_UPDATE: 'bg-amber',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function isOnline(lastLoginAt: string | null): boolean {
  if (!lastLoginAt) return false;
  return Date.now() - new Date(lastLoginAt).getTime() < ONLINE_WINDOW_MS;
}

function StaffRow({ member, locale, dict }: { member: AdminStaffMember; locale: 'ar' | 'en'; dict: ReturnType<typeof getDictionary> }) {
  const online = isOnline(member.last_login_at);
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-line dark:border-d-line last:border-b-0">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-small">
          {initials(member.name)}
        </div>
        {online && (
          <div className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-ok border-2 border-white dark:border-d-surface" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-small font-bold text-ink dark:text-d-text truncate">{member.name}</div>
        <div className="text-micro font-mono text-ink-mute dark:text-d-textMute truncate">
          {member.email ?? member.phone}
        </div>
      </div>
      <div className="text-micro px-2 py-1 rounded-bartal bg-sand dark:bg-d-raised text-ink dark:text-d-text font-semibold">
        {dict.staff.roles[member.role]}
      </div>
      <div className="text-micro text-ink-mute dark:text-d-textMute min-w-[80px] text-end">
        {online
          ? dict.staff.online
          : member.last_login_at
            ? new Date(member.last_login_at).toLocaleDateString(
                locale === 'ar' ? 'ar-EG' : 'en-GB',
                { day: '2-digit', month: 'short' },
              )
            : dict.staff.neverLoggedIn}
      </div>
    </div>
  );
}

function AuditRow({ entry, locale }: { entry: AdminAuditEntry; locale: 'ar' | 'en' }) {
  const accent = ACTION_ACCENT[entry.action] ?? 'bg-line';
  return (
    <div className="flex items-stretch gap-3 px-4 py-3 border-b border-line dark:border-d-line last:border-b-0">
      <div className={clsx('w-1 rounded-full', accent)} />
      <div className="flex-1 min-w-0">
        <div className="text-small text-ink dark:text-d-text">
          <strong>{entry.actor.name}</strong>{' '}
          <span className="text-ink-mute dark:text-d-textMute">{entry.action}</span>{' '}
          <span className="font-mono text-amber font-bold">
            {entry.entity_type}#{entry.entity_id.slice(-6)}
          </span>
        </div>
      </div>
      <div className="text-micro font-mono text-ink-mute dark:text-d-textMute self-center">
        {new Date(entry.created_at).toLocaleTimeString(
          locale === 'ar' ? 'ar-EG' : 'en-GB',
          { hour: '2-digit', minute: '2-digit' },
        )}
      </div>
    </div>
  );
}

export function StaffPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.staff.title);

  const { data: staff, isLoading: staffLoading } = useAdminStaff();
  const { data: audit, isLoading: auditLoading } = useAdminAuditFeed({ limit: 30 });

  const members = staff?.items ?? [];
  const entries = audit?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-small text-ink-mute dark:text-d-textMute">
            {dict.staff.subtitle.replace('{n}', String(members.length))}
          </p>
        </div>
        <AdmButton disabled title={dict.staff.inviteComingSoon}>
          {dict.staff.inviteBtn}
        </AdmButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4">
        <div className="space-y-2">
          <div className="text-small font-bold text-ink dark:text-d-text">
            {dict.staff.teamHeading}
          </div>
          <AdmCard padded={false}>
            {staffLoading ? (
              <div className="p-6 text-center text-small text-ink-mute dark:text-d-textMute">
                {dict.common.loading}
              </div>
            ) : members.length === 0 ? (
              <AdmEmptyState title={dict.staff.emptyStaff} />
            ) : (
              members.map((m) => <StaffRow key={m.id} member={m} locale={locale} dict={dict} />)
            )}
          </AdmCard>
        </div>

        <div className="space-y-2">
          <div className="text-small font-bold text-ink dark:text-d-text">
            {dict.staff.auditHeading}
          </div>
          <AdmCard padded={false}>
            {auditLoading ? (
              <div className="p-6 text-center text-small text-ink-mute dark:text-d-textMute">
                {dict.common.loading}
              </div>
            ) : entries.length === 0 ? (
              <AdmEmptyState title={dict.staff.emptyAudit} />
            ) : (
              entries.map((e) => <AuditRow key={e.id} entry={e} locale={locale} />)
            )}
          </AdmCard>
        </div>
      </div>
    </div>
  );
}
