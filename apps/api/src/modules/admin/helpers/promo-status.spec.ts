import { derivePromoStatus } from './promo-status';

const NOW = new Date('2026-06-15T12:00:00Z');

describe('derivePromoStatus', () => {
  it('returns inactive when is_active=false (regardless of dates)', () => {
    expect(
      derivePromoStatus(
        { is_active: false, starts_at: null, expires_at: null },
        NOW,
      ),
    ).toBe('inactive');
  });

  it('returns expired when expires_at is in the past', () => {
    expect(
      derivePromoStatus(
        {
          is_active: true,
          starts_at: null,
          expires_at: new Date('2026-05-01T00:00:00Z'),
        },
        NOW,
      ),
    ).toBe('expired');
  });

  it('returns scheduled when starts_at is in the future', () => {
    expect(
      derivePromoStatus(
        {
          is_active: true,
          starts_at: new Date('2026-07-01T00:00:00Z'),
          expires_at: null,
        },
        NOW,
      ),
    ).toBe('scheduled');
  });

  it('returns active when within window', () => {
    expect(
      derivePromoStatus(
        {
          is_active: true,
          starts_at: new Date('2026-06-01T00:00:00Z'),
          expires_at: new Date('2026-07-01T00:00:00Z'),
        },
        NOW,
      ),
    ).toBe('active');
  });

  it('returns active when both starts_at and expires_at are null', () => {
    expect(
      derivePromoStatus(
        { is_active: true, starts_at: null, expires_at: null },
        NOW,
      ),
    ).toBe('active');
  });

  it('expired takes precedence over scheduled', () => {
    // edge case: starts_at in future AND expires_at in past — invalid input,
    // but defensive behavior: expired wins (already past its end).
    expect(
      derivePromoStatus(
        {
          is_active: true,
          starts_at: new Date('2026-07-01T00:00:00Z'),
          expires_at: new Date('2026-05-01T00:00:00Z'),
        },
        NOW,
      ),
    ).toBe('expired');
  });
});
