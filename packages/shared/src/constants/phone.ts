/**
 * Sudan phone numbers: country code +249 followed by 9 digits.
 * Per PRD §7.1.1 — registration phone format.
 */
export const SUDAN_COUNTRY_CODE = '+249';
export const SUDAN_PHONE_REGEX = /^\+249\d{9}$/;

export function isValidSudanPhone(phone: string): boolean {
  return SUDAN_PHONE_REGEX.test(phone);
}

/**
 * Normalize a user-entered phone to E.164 `+249XXXXXXXXX`.
 * Accepts: `0912345678`, `912345678`, `+249912345678`, `00249912345678`, `249912345678`.
 * Returns null if the result doesn't match the 9-digit subscriber pattern.
 */
export function normalizeSudanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  let subscriber: string;

  if (digits.startsWith('00249')) {
    subscriber = digits.slice(5);
  } else if (digits.startsWith('249')) {
    subscriber = digits.slice(3);
  } else if (digits.startsWith('0')) {
    subscriber = digits.slice(1);
  } else {
    subscriber = digits;
  }

  if (subscriber.length !== 9) return null;
  return SUDAN_COUNTRY_CODE + subscriber;
}

/** Mask a phone for display: `+249 91 ••• ••78`. */
export function maskSudanPhone(phone: string): string {
  if (!isValidSudanPhone(phone)) return phone;
  return `${phone.slice(0, 6)} ••• ••${phone.slice(-2)}`;
}
