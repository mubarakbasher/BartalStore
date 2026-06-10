'use client';
import { useRef } from 'react';
import type { Address } from '@bartal/shared';
import { useAddresses } from '@/lib/state/addresses-store';

/**
 * Seeds the client addresses cache from a Server Component fetch. Renders
 * nothing. Hydrates once on first mount so client mutations aren't clobbered.
 */
export function HydrateAddresses({ items }: { items: Address[] }) {
  const hydrate = useAddresses((s) => s.hydrate);
  const done = useRef(false);
  if (!done.current) {
    done.current = true;
    hydrate(items);
  }
  return null;
}
