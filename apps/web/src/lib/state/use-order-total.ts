'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/config';
import { useCart } from './cart-store';
import { useCheckout } from './checkout-store';
import { useDeliveryZones } from '../api/queries';
import type { DeliveryZoneInfo } from '../api/types';

export interface OrderTotal {
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDelivery: boolean;
  activeZone: DeliveryZoneInfo | undefined;
  hydrated: boolean;
}

export function useOrderTotal(locale: Locale): OrderTotal {
  const subtotalRaw = useCart((s) => s.subtotal());
  const selectedZoneIdx = useCheckout((s) => s.selectedZoneIdx);
  const zones = useDeliveryZones(locale);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const subtotal = hydrated ? subtotalRaw : 0;
  const activeZone = zones.data?.[selectedZoneIdx];
  const deliveryFee = !activeZone
    ? 0
    : activeZone.free_above_sdg !== null && subtotal >= activeZone.free_above_sdg
      ? 0
      : activeZone.fee_sdg;
  const total = subtotal + deliveryFee;
  const freeDelivery = Boolean(activeZone && deliveryFee === 0 && subtotal > 0);

  return { subtotal, deliveryFee, total, freeDelivery, activeZone, hydrated };
}
