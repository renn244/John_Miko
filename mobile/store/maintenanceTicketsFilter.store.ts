import { create } from "zustand";

export type MaintenanceTicketsFilterState = {
    search: string;
    setSearch: (search: string) => void;
}

export const useMaintenanceTicketsFilterStore = create<MaintenanceTicketsFilterState>((set) => ({
    search: "",
    setSearch: (search) => set({ search })
}))