import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminLocale = 'ar' | 'en';
export type AdminTheme = 'light' | 'dark';

interface PrefsState {
  locale: AdminLocale;
  theme: AdminTheme;
  setLocale: (locale: AdminLocale) => void;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      theme: 'light',
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: 'bartal-admin-prefs', version: 1 },
  ),
);
