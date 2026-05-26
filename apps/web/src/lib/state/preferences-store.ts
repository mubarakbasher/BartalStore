'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

interface NotificationToggles {
  orderUpdates: boolean;
  promotions: boolean;
  whatsapp: boolean;
}

interface PreferencesState {
  theme: ThemePreference;
  notifications: NotificationToggles;
  setTheme: (t: ThemePreference) => void;
  toggleNotification: (key: keyof NotificationToggles) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: {
        orderUpdates: true,
        promotions: false,
        whatsapp: true,
      },
      setTheme: (theme) => set({ theme }),
      toggleNotification: (key) =>
        set((s) => ({
          notifications: { ...s.notifications, [key]: !s.notifications[key] },
        })),
    }),
    { name: 'bartal-preferences', version: 1 },
  ),
);
