import type { BankInfo } from '@/components/checkout/BankRadioCard';

export const BANKS: BankInfo[] = [
  {
    id: 'faisal',
    name_ar: 'بنك فيصل الإسلامي',
    name_en: 'Faisal Islamic Bank',
    account: '0012-345-678-9000',
    swift: 'FIBSSDKH',
    iban: 'SD13 4567 8900 1234 5678 9000',
  },
  {
    id: 'omdurman',
    name_ar: 'بنك أم درمان الوطني',
    name_en: 'Omdurman National',
    account: '4455-223-119-8800',
    swift: 'ONBKSDKH',
    iban: 'SD42 1198 8004 4552 2311 9800',
  },
  {
    id: 'khartoum',
    name_ar: 'بنك الخرطوم',
    name_en: 'Bank of Khartoum',
    account: '7708-661-223-0012',
    swift: 'BKHTSDKH',
    iban: 'SD78 0012 7708 6612 2300 1200',
  },
];

export function findBankById(id: string): BankInfo | undefined {
  return BANKS.find((b) => b.id === id);
}

export const PREVIEW_ORDER_REFERENCE = 'BRT-2026-PREVIEW';
