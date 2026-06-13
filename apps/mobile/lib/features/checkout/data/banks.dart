/// Bartal's bank accounts for the bank-transfer step. There is no customer API
/// endpoint for these — mirrored verbatim from the web app
/// (`apps/web/src/lib/state/checkout-banks.ts`) and matching the design's three
/// banks. If the backend later exposes a settings endpoint, swap this for a fetch.
class BankInfo {
  const BankInfo({
    required this.id,
    required this.nameAr,
    required this.nameEn,
    required this.account,
    required this.swift,
    required this.iban,
  });

  final String id;
  final String nameAr;
  final String nameEn;
  final String account;
  final String swift;
  final String iban;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
}

/// Account holder shown on every bank (the receiving entity).
const bankAccountHolderAr = 'برتال للتجارة الإلكترونية';
const bankAccountHolderEn = 'Bartal E-Commerce';

const bartalBanks = <BankInfo>[
  BankInfo(
    id: 'faisal',
    nameAr: 'بنك فيصل الإسلامي',
    nameEn: 'Faisal Islamic Bank',
    account: '0012-345-678-9000',
    swift: 'FIBSSDKH',
    iban: 'SD13 4567 8900 1234 5678 9000',
  ),
  BankInfo(
    id: 'omdurman',
    nameAr: 'بنك أم درمان الوطني',
    nameEn: 'Omdurman National',
    account: '4455-223-119-8800',
    swift: 'ONBKSDKH',
    iban: 'SD42 1198 8004 4552 2311 9800',
  ),
  BankInfo(
    id: 'khartoum',
    nameAr: 'بنك الخرطوم',
    nameEn: 'Bank of Khartoum',
    account: '7708-661-223-0012',
    swift: 'BKHTSDKH',
    iban: 'SD78 0012 7708 6612 2300 1200',
  ),
];
