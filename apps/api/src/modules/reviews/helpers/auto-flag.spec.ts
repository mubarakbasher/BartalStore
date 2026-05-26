import { runAutoFlag } from './auto-flag';

describe('runAutoFlag', () => {
  it('returns null for empty or missing comment', () => {
    expect(runAutoFlag(5, null)).toBeNull();
    expect(runAutoFlag(5, undefined)).toBeNull();
    expect(runAutoFlag(5, '')).toBeNull();
  });

  it('returns null for clean comments', () => {
    expect(runAutoFlag(5, 'great product, smells amazing')).toBeNull();
    expect(runAutoFlag(3, 'okay delivery, arrived late')).toBeNull();
  });

  it('flags spam keywords (case-insensitive)', () => {
    expect(runAutoFlag(1, 'arrived DEFECTIVE')).toBe('Auto-flag: contains "defective"');
    expect(runAutoFlag(1, 'looks fake to me')).toBe('Auto-flag: contains "fake"');
    expect(runAutoFlag(1, 'this is a scam')).toBe('Auto-flag: contains "scam"');
  });

  it('flags URLs in https / http / www forms', () => {
    expect(runAutoFlag(5, 'visit https://example.com')).toBe('Auto-flag: contains URL');
    expect(runAutoFlag(5, 'http://x.test/products')).toBe('Auto-flag: contains URL');
    expect(runAutoFlag(5, 'see www.spamsite.example for cheaper')).toBe(
      'Auto-flag: contains URL',
    );
  });

  it('flags URL + keyword combination with compound reason', () => {
    expect(runAutoFlag(1, 'fake — see https://bad.example')).toBe(
      'Auto-flag: spam keywords + URL',
    );
  });
});
