import { create } from "zustand";

const store = create();

export type User = {
  name: string;
  email: string;
  phone: string;
};

interface StoreState {
  user: User | null;
  tier: string;
  setUser: (user: User) => void;
  setTier: (tier: string) => void;
  reset: () => void;
}


export const useStore = create<StoreState>((set) => ({
  user: null,
  tier: '',
  setUser: (user) => set({ user }),
  setTier: (tier) => set({ tier }),
  reset: () => set({ user: null, tier: '' }),
}));