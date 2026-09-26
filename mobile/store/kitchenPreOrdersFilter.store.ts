import { create } from "zustand";
import type { KitchenOrderStatus } from "@/types/kitchenOrder.type";

export type KitchenPreOrdersFilterState = {
  search: string;
  date: string; // YYYY-MM-DD
  status?: KitchenOrderStatus;
  setSearch: (search: string) => void;
  setDate: (date: string) => void;
  setStatus: (status?: KitchenOrderStatus) => void;
  reset: () => void;
};

export const useKitchenPreOrdersFilterStore = create<KitchenPreOrdersFilterState>((set) => ({
  search: "",
  date: "",
  status: undefined,
  setSearch: (search) => set({ search }),
  setDate: (date) => set({ date }),
  setStatus: (status) => set({ status }),
  reset: () => set({ search: "", date: "", status: undefined }),
}));
