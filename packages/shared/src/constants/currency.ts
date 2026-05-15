import { Language } from '../enums';

export const CURRENCY_CODE = 'SDG';

/**
 * Format an amount in Sudanese Pounds.
 * Arabic locale uses Arabic-Indic numerals (٠-٩) and ج.س. suffix.
 * English locale uses Western numerals and `SDG` prefix.
 */
export function formatSDG(amount: number | string, language: Language = Language.AR): string {
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (!Number.isFinite(num)) return language === Language.AR ? '٠ ج.س.' : 'SDG 0';

  if (language === Language.AR) {
    const formatted = new Intl.NumberFormat('ar-EG', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(num);
    return `${formatted} ج.س.`;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);
  return `SDG ${formatted}`;
}

/** Parse a user-entered SDG string (with either numeral system) back to a number. */
export function parseSDG(input: string): number | null {
  const arabicIndicToWestern = input.replace(/[٠-٩]/g, (d) =>
    String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)),
  );
  const clean = arabicIndicToWestern.replace(/[^\d.-]/g, '');
  const num = Number(clean);
  return Number.isFinite(num) ? num : null;
}
