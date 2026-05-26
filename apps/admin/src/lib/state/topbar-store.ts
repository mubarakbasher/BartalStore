import { useEffect } from 'react';
import { create } from 'zustand';

interface TopbarState {
  title: string;
  subtitle: string | null;
  set: (title: string, subtitle?: string | null) => void;
}

export const useTopbarStore = create<TopbarState>((set) => ({
  title: 'Dashboard',
  subtitle: null,
  set: (title, subtitle = null) => set({ title, subtitle }),
}));

export function useTopbarTitle(title: string, subtitle: string | null = null): void {
  const setTitle = useTopbarStore((s) => s.set);
  useEffect(() => {
    setTitle(title, subtitle);
  }, [title, subtitle, setTitle]);
}
