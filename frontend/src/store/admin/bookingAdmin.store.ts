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

    isMarkCompletedOpen: boolean;
    setIsMarkCompletedOpen: (open: boolean) => void;
    markCompletedBookingId: string | undefined;
    setMarkCompletedBookingId: (id: string | undefined) => void;

    isMarkCancelOpen: boolean;
    setIsMarkCancelOpen: (open: boolean) => void;
    markCancelBookingId: string | undefined;
    setMarkCancelBookingId: (id: string | undefined) => void;
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

    isMarkCompletedOpen: false,
    setIsMarkCompletedOpen: (open) => {
        set((state) => {
            if (open && state.markCompletedBookingId === undefined) {
                console.warn("Cannot open without markCompletedBookingId");
                return state;
            }
            
            return {
                isMarkCompletedOpen: open,
                markCompletedBookingId: open ? state.markCompletedBookingId : undefined,
            };
        });
    },
    markCompletedBookingId: undefined,
    setMarkCompletedBookingId: (id) => {
        set({
            markCompletedBookingId: id,
            isMarkCompletedOpen: id === undefined ? false : true,
        });
    },

    isMarkCancelOpen: false,
    setIsMarkCancelOpen: (open) => {
        set((state) => {
            if (open && state.markCancelBookingId === undefined) {
                console.warn("Cannot open without markCancelBookingId");
                return state;
            }

            return {
                isMarkCancelOpen: open,
                markCancelBookingId: open ? state.markCancelBookingId : undefined,
            };
        });
    },
    markCancelBookingId: undefined,
    setMarkCancelBookingId: (id) => {
        set({
            markCancelBookingId: id,
            isMarkCancelOpen: id === undefined ? false : true,
        });
    },
}))