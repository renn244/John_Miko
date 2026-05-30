import { create } from "zustand";

export type KitchenPreOrdersFilterState = {
  search: string;
  date: string; // YYYY-MM-DD
  setSearch: (search: string) => void;
  setDate: (date: string) => void;
  reset: () => void;
};

export const useKitchenPreOrdersFilterStore = create<KitchenPreOrdersFilterState>((set) => ({
  search: "",
  date: "",
  setSearch: (search) => set({ search }),
  setDate: (date) => set({ date }),
  reset: () => set({ search: "", date: "" }),
}));
