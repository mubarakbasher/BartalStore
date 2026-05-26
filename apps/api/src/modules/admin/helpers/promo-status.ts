export type DerivedPromoStatus = 'active' | 'scheduled' | 'expired' | 'inactive';

interface PromoLike {
  is_active: boolean;
  starts_at: Date | null;
  expires_at: Date | null;
}

/**
 * Pure derive — no Prisma access. `now` is injectable for tests.
 *
 * - `inactive`  → is_active=false (soft-deleted by admin)
 * - `expired`   → expires_at < now
 * - `scheduled` → starts_at > now
 * - `active`    → currently usable
 */
export function derivePromoStatus(p: PromoLike, now: Date = new Date()): DerivedPromoStatus {
  if (!p.is_active) return 'inactive';
  if (p.expires_at && p.expires_at < now) return 'expired';
  if (p.starts_at && p.starts_at > now) return 'scheduled';
  return 'active';
}
