import { createHash, randomBytes, randomInt } from 'node:crypto';

/**
 * Generate a high-entropy opaque refresh token (~384 bits) the client stores.
 * Returned base64url-encoded so it's URL-safe and header-safe.
 */
export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

/**
 * Deterministic sha256 hash of a refresh token — what we persist in
 * `refresh_tokens.token_hash` so we can do a fast indexed `findUnique`.
 * The token itself is high-entropy random data, so plain sha256 (no salt)
 * is fine; we're not protecting against rainbow tables on a user-chosen secret.
 */
export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** 6-digit zero-padded OTP code (e.g. "048391"). */
export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

/**
 * Parse a JWT-style TTL string like "15m" / "30d" / "3600s" into seconds.
 * Falls back to the provided default when the format is unrecognised.
 */
export function parseTtlSeconds(ttl: string | undefined, fallbackSeconds: number): number {
  if (!ttl) return fallbackSeconds;
  const match = /^(\d+)([smhd])$/.exec(ttl.trim());
  if (!match) {
    const asNumber = Number(ttl);
    return Number.isFinite(asNumber) ? asNumber : fallbackSeconds;
  }
  const n = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's': return n;
    case 'm': return n * 60;
    case 'h': return n * 60 * 60;
    case 'd': return n * 60 * 60 * 24;
    default:  return fallbackSeconds;
  }
}
