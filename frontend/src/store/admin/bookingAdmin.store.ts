import { create } from "zustand";

type bookingAdminStore = {
    isViewOpen: boolean;
    setIsViewOpen: (open: boolean) => void;
    viewId: string | undefined;
    setViewId: (id: string | undefined) => void;

    isRescheduleOpen: boolean;
    setIsRescheduleOpen: (open: boolean) => void;
    rescheduleBookingId: string | undefined;
    setRescheduleBookingId: (id: string | undefined) => void;
}

export const useBookingAdminStore = create<bookingAdminStore>((set) => ({
    isViewOpen: false,
    setIsViewOpen: (open) => {
        set((state) => {
            if (open && state.viewId === undefined) {
                console.warn("Cannot open without viewId");
                return state;
            }

            return {
                isViewOpen: open,
                viewId: open ? state.viewId : undefined,
            };
        });
    },
    viewId: undefined,
    setViewId: (id) => {
        set({
            viewId: id,
            isViewOpen: id === undefined ? false : true,
        });
    },

    isRescheduleOpen: false,
    setIsRescheduleOpen: (open) => {
        set((state) => {
            if (open && state.rescheduleBookingId === undefined) {
                console.warn("Cannot open without rescheduleBookingId");
                return state;
            }
            
            return {
                isRescheduleOpen: open,
                rescheduleBookingId: open ? state.rescheduleBookingId : undefined,
            };
        });
    },
    rescheduleBookingId: undefined,
    setRescheduleBookingId: (id) => {
        set({
            rescheduleBookingId: id,
            isRescheduleOpen: id === undefined ? false : true,
        });
    },
}))