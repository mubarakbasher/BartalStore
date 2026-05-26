'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderItem } from '@bartal/shared';

const items_two: OrderItem[] = [
  {
    productId: 'p-oud',
    slug: 'royal-oud',
    name_ar: 'دهن العود الملكي',
    name_en: 'Royal Oud Perfume Oil',
    brand: 'Ajmal',
    hue: 'amber',
    imageUrl: null,
    sku: 'AJM-OUD-3ML',
    unitPrice: 42_000,
    quantity: 1,
  },
  {
    productId: 'p-headphones',
    slug: 'wireless-pro-headphones',
    name_ar: 'سماعات لاسلكية برو',
    name_en: 'Wireless Pro Headphones',
    brand: 'Anker',
    hue: 'navy',
    imageUrl: null,
    sku: 'ANK-WHP-PRO',
    unitPrice: 185_000,
    quantity: 1,
  },
];

const items_single = (slug: string, name_ar: string, name_en: string, brand: string, hue: string, sku: string, unitPrice: number, quantity = 1): OrderItem[] => [
  {
    productId: `p-${slug}`,
    slug,
    name_ar,
    name_en,
    brand,
    hue,
    imageUrl: null,
    sku,
    unitPrice,
    quantity,
  },
];

const shippingAddress = {
  id: 'home',
  label: 'home' as const,
  name: 'Mohammed Osman Ahmed',
  phone: '+249 91 234 5678',
  line_ar: 'الرياض، بلوك ٣٢، منزل ١٤',
  line_en: 'Al-Riyadh, block 32, house 14',
  city_ar: 'الخرطوم',
  city_en: 'Khartoum',
  zone: 'B' as const,
  landmark_ar: 'بجانب مسجد النور',
  landmark_en: 'Next to Al-Nur Mosque',
  isDefault: true,
};

const DEMO_ORDERS: Order[] = [
  {
    id: 'BRT-2026-00842',
    number: 'BRT-2026-00842',
    placedAt: '2026-04-19T14:14:00Z',
    status: 'verified',
    items: items_two,
    subtotal: 227_000,
    deliveryFee: 1_000,
    total: 228_000,
    shippingAddress,
    payment: {
      method: 'bank_transfer',
      bankId: 'faisal',
      receipt: {
        bank_ar: 'بنك فيصل الإسلامي',
        bank_en: 'Faisal Islamic Bank',
        amount: 228_000,
        reference: 'BRT-2026-00842',
        uploadedAt: '2026-04-19T14:32:00Z',
        status: 'approved',
      },
    },
    timeline: [
      { status: 'placed', at: '2026-04-19T14:14:00Z' },
      { status: 'review', at: '2026-04-19T14:32:00Z' },
      { status: 'verified', at: '2026-04-19T16:51:00Z' },
      { status: 'preparing' },
      { status: 'shipped' },
      { status: 'delivered' },
    ],
  },
  {
    id: 'BRT-2026-00829',
    number: 'BRT-2026-00829',
    placedAt: '2026-04-17T11:02:00Z',
    status: 'shipped',
    items: items_single('cardamom-tea', 'شاي بالهيل', 'Cardamom Tea Premium', 'Sudan Roast', 'warm', 'SDR-TEA-CRD', 12_000, 2),
    subtotal: 24_000,
    deliveryFee: 18_000,
    total: 42_000,
    shippingAddress,
    payment: {
      method: 'cod',
    },
    timeline: [
      { status: 'placed', at: '2026-04-17T11:02:00Z' },
      { status: 'verified', at: '2026-04-17T11:05:00Z' },
      { status: 'preparing', at: '2026-04-17T15:30:00Z' },
      { status: 'shipped', at: '2026-04-18T09:14:00Z' },
      { status: 'delivered' },
    ],
  },
  {
    id: 'BRT-2026-00811',
    number: 'BRT-2026-00811',
    placedAt: '2026-04-12T18:40:00Z',
    status: 'delivered',
    items: items_single('karkadeh', 'كركديه طبيعي', 'Karkadeh (Hibiscus) — Pure', 'Sudan Roast', 'rose', 'SDR-KAR-500', 95_000),
    subtotal: 95_000,
    deliveryFee: 0,
    total: 95_000,
    shippingAddress,
    payment: {
      method: 'bank_transfer',
      bankId: 'omdurman',
      receipt: {
        bank_ar: 'بنك أمدرمان الوطني',
        bank_en: 'Omdurman National Bank',
        amount: 95_000,
        reference: 'BRT-2026-00811',
        uploadedAt: '2026-04-12T18:58:00Z',
        status: 'approved',
      },
    },
    timeline: [
      { status: 'placed', at: '2026-04-12T18:40:00Z' },
      { status: 'review', at: '2026-04-12T18:58:00Z' },
      { status: 'verified', at: '2026-04-12T19:33:00Z' },
      { status: 'preparing', at: '2026-04-13T09:00:00Z' },
      { status: 'shipped', at: '2026-04-14T11:20:00Z' },
      { status: 'delivered', at: '2026-04-15T16:42:00Z' },
    ],
  },
  {
    id: 'BRT-2026-00794',
    number: 'BRT-2026-00794',
    placedAt: '2026-04-05T09:14:00Z',
    status: 'delivered',
    items: [
      ...items_single('amber-bakhoor', 'بخور العنبر', 'Amber Bakhoor Sticks', 'Al Haramain', 'amber', 'ALH-BKR-AMB', 38_000, 2),
      ...items_single('silk-shawl', 'شال حريري', 'Silk Embroidered Shawl', 'Al-Khartoum Looms', 'rose', 'AKL-SHL-SLK', 80_000),
    ],
    subtotal: 156_000,
    deliveryFee: 0,
    total: 156_000,
    shippingAddress,
    payment: {
      method: 'bank_transfer',
      bankId: 'bok',
      receipt: {
        bank_ar: 'بنك الخرطوم',
        bank_en: 'Bank of Khartoum',
        amount: 156_000,
        reference: 'BRT-2026-00794',
        uploadedAt: '2026-04-05T10:01:00Z',
        status: 'approved',
      },
    },
    timeline: [
      { status: 'placed', at: '2026-04-05T09:14:00Z' },
      { status: 'review', at: '2026-04-05T10:01:00Z' },
      { status: 'verified', at: '2026-04-05T11:22:00Z' },
      { status: 'preparing', at: '2026-04-06T08:30:00Z' },
      { status: 'shipped', at: '2026-04-07T10:45:00Z' },
      { status: 'delivered', at: '2026-04-08T14:18:00Z' },
    ],
  },
  {
    id: 'BRT-2026-00760',
    number: 'BRT-2026-00760',
    placedAt: '2026-03-28T16:22:00Z',
    status: 'cancelled',
    items: items_single('phone-case-clear', 'حافظة شفافة', 'Clear Phone Case — iPhone 14', 'Spigen', 'navy', 'SPG-CSE-IP14', 28_500),
    subtotal: 28_500,
    deliveryFee: 0,
    total: 28_500,
    shippingAddress,
    payment: {
      method: 'bank_transfer',
      bankId: 'faisal',
    },
    timeline: [
      { status: 'placed', at: '2026-03-28T16:22:00Z' },
      { status: 'cancelled', at: '2026-03-29T08:14:00Z' },
    ],
  },
];

interface OrdersState {
  orders: Order[];
}

export const useOrders = create<OrdersState>()(
  persist(
    () => ({
      orders: DEMO_ORDERS,
    }),
    { name: 'bartal-orders', version: 1 },
  ),
);

export function findOrder(id: string): Order | undefined {
  return useOrders.getState().orders.find((o) => o.id === id || o.number === id);
}
