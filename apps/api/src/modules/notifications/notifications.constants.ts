/**
 * Canonical status values written to `SmsLog.status`. The column is `String`
 * in the schema (not a DB enum) so callers can extend without a migration.
 */
export const SMS_LOG_STATUS = {
  /** Row inserted, HTTP request not yet attempted. Transient on the happy path. */
  PENDING: 'PENDING',
  /** Africa's Talking accepted the message (statusCode 101 or 102). */
  SENT: 'SENT',
  /** AT rejected, HTTP error, or timeout. `error_message` carries the detail. */
  FAILED: 'FAILED',
  /** Stub mode — no AT credentials set in this environment. */
  STUBBED: 'STUBBED',
} as const;
export type SmsLogStatus = (typeof SMS_LOG_STATUS)[keyof typeof SMS_LOG_STATUS];

export const SMS_PROVIDER_AT = 'africas_talking';
export const AT_TIMEOUT_MS = 10_000;
/** AT statusCodes that mean "we'll deliver this." Anything else is a failure. */
export const AT_SUCCESS_STATUS_CODES: ReadonlySet<number> = new Set([101, 102]);
