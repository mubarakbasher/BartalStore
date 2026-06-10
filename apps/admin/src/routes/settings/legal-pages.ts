export const LEGAL_PAGES = ['terms', 'privacy', 'refund', 'shipping', 'about', 'contact'] as const;
export type LegalSlug = (typeof LEGAL_PAGES)[number];
