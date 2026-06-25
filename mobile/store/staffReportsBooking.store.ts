import { create } from "zustand";

type StaffReportsBookingFilter = {
    search: string;
    setSearch: (search: string) => void;
}

export const useStaffReportsBookingFilterStore = create<StaffReportsBookingFilter>((set) => ({
    search: "",
    setSearch: (search) => set({ search }),
}))