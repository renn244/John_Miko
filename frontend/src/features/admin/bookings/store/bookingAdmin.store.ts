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

    isRejectPaymentOpen: boolean;
    setIsRejectPaymentOpen: (open: boolean) => void;
    rejectPaymentId: string | undefined;
    setRejectPaymentId: (id: string | undefined) => void;

    isRefundPaymentOpen: boolean;
    setIsRefundPaymentOpen: (open: boolean) => void;
    refundPayment: { id: string; amountPaid: number } | undefined;
    setRefundPayment: (
        payment: { id: string; amountPaid: number } | undefined,
    ) => void;
};

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
                viewId: state.viewId,
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
                rescheduleBookingId: state.rescheduleBookingId,
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
                markCompletedBookingId: state.markCompletedBookingId,
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
                markCancelBookingId: state.markCancelBookingId,
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

    isRejectPaymentOpen: false,
    setIsRejectPaymentOpen: (open) => {
        set((state) => {
            if (open && state.rejectPaymentId === undefined) {
                console.warn("Cannot open without rejectPaymentId");
                return state;
            }

            return {
                isRejectPaymentOpen: open,
                rejectPaymentId: state.rejectPaymentId,
            };
        });
    },
    rejectPaymentId: undefined,
    setRejectPaymentId: (id) => {
        set({
            rejectPaymentId: id,
            isRejectPaymentOpen: id !== undefined,
        });
    },

    isRefundPaymentOpen: false,
    setIsRefundPaymentOpen: (open) => {
        set((state) => {
            if (open && state.refundPayment === undefined) {
                console.warn("Cannot open without refundPayment");
                return state;
            }

            return {
                isRefundPaymentOpen: open,
                refundPayment: state.refundPayment,
            };
        });
    },
    refundPayment: undefined,
    setRefundPayment: (payment) => {
        set({
            refundPayment: payment,
            isRefundPaymentOpen: payment !== undefined,
        });
    },
}));
