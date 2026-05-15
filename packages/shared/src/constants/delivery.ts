import { DeliveryZone } from '../enums';

/**
 * Khartoum delivery zones per PRD §7.2.5 + §12.
 * Fees in SDG. Adjustable from the admin dashboard at runtime — these are
 * defaults seeded into the database, not hard limits.
 */
export interface DeliveryZoneConfig {
  zone: DeliveryZone;
  name_ar: string;
  name_en: string;
  default_fee_sdg: number;
  free_above_sdg: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
  districts_ar: string[];
  districts_en: string[];
}

export const KHARTOUM_DELIVERY_ZONES: DeliveryZoneConfig[] = [
  {
    zone: DeliveryZone.ZONE_A,
    name_ar: 'الخرطوم',
    name_en: 'Khartoum',
    default_fee_sdg: 500,
    free_above_sdg: 50_000,
    estimated_days_min: 1,
    estimated_days_max: 2,
    districts_ar: ['الخرطوم 2', 'المعمورة', 'الرياض', 'العمارات', 'الطائف', 'برى'],
    districts_en: ['Khartoum 2', 'Al-Mamoura', 'Al-Riyadh', 'Al-Amarat', 'Al-Taif', 'Burri'],
  },
  {
    zone: DeliveryZone.ZONE_B,
    name_ar: 'أم درمان',
    name_en: 'Omdurman',
    default_fee_sdg: 800,
    free_above_sdg: 50_000,
    estimated_days_min: 2,
    estimated_days_max: 3,
    districts_ar: ['أم درمان الكبرى', 'الثورة', 'ود نوباوي', 'العباسية', 'بانت'],
    districts_en: ['Greater Omdurman', 'Al-Thawra', 'Wad Nubawi', 'Al-Abbasiya', 'Bantyou'],
  },
  {
    zone: DeliveryZone.ZONE_C,
    name_ar: 'الخرطوم بحري',
    name_en: 'Khartoum North (Bahri)',
    default_fee_sdg: 700,
    free_above_sdg: 50_000,
    estimated_days_min: 2,
    estimated_days_max: 3,
    districts_ar: ['بحري', 'الحاج يوسف', 'كافوري', 'شمبات', 'الصحافة'],
    districts_en: ['Bahri', 'Al-Hajj Yousif', 'Kafouri', 'Shambat', 'Al-Sahafa'],
  },
  {
    zone: DeliveryZone.ZONE_D,
    name_ar: 'ما حول الخرطوم',
    name_en: 'Greater Khartoum outskirts',
    default_fee_sdg: 1_200,
    free_above_sdg: 80_000,
    estimated_days_min: 3,
    estimated_days_max: 5,
    districts_ar: ['سوبا', 'جبل أولياء', 'الجريف', 'الكلاكلة'],
    districts_en: ['Soba', 'Jabal Awliya', 'Al-Gureif', 'Al-Kalakla'],
  },
];

export const DELIVERY_ZONE_BY_KEY: Record<DeliveryZone, DeliveryZoneConfig> = Object.freeze(
  KHARTOUM_DELIVERY_ZONES.reduce(
    (acc, z) => ({ ...acc, [z.zone]: z }),
    {} as Record<DeliveryZone, DeliveryZoneConfig>,
  ),
);

/** Flat list of all known districts (for address-form auto-complete + zone detection). */
export const ALL_DISTRICTS = KHARTOUM_DELIVERY_ZONES.flatMap((z) =>
  z.districts_en.map((en, i) => ({
    zone: z.zone,
    ar: z.districts_ar[i] ?? en,
    en,
  })),
);

export function zoneForDistrict(district: string): DeliveryZone | null {
  const needle = district.trim().toLowerCase();
  const match = ALL_DISTRICTS.find(
    (d) => d.en.toLowerCase() === needle || d.ar === district.trim(),
  );
  return match?.zone ?? null;
}
