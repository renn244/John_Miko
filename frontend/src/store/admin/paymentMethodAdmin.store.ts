import { create } from "zustand";

type paymentMethodAdminStore = {
    // delete payment methods
    isDeleteOpen: boolean;
    setIsDeleteOpen: (open: boolean) => void;
    deleteId: string | null;
    setDeleteId: (methodId: string | null) => void;

    isAvailabilityConfirmationOpen: boolean;
    setIsAvailabilityConfirmationOpen: (open: boolean) => void;
    availabilityConfirmationId: string | null;
    setAvailabilityConfirmationId: (methodId: string | null) => void;
}

export const paymentMethodAdminStore = create<paymentMethodAdminStore>((set) => ({
    isDeleteOpen: false,
    setIsDeleteOpen: (open) => {
        set((state) => {
            if(open && state.deleteId === null) {
                console.warn("Cannot open without deleteId")
                return state
            }

            return {
                isDeleteOpen: open,
                deleteId: open ? state.deleteId : null
            }
        })
    },
    deleteId: null,
    setDeleteId: (id) => {
        set({
            deleteId: id,
            isDeleteOpen: id === null ? false : true
        })
    },

    isAvailabilityConfirmationOpen: false,
    setIsAvailabilityConfirmationOpen: (open) => {
        set((state) => {
            if(open && state.availabilityConfirmationId === null) {
                console.warn("Cannot open without availabilityConfirmationId")
                return state
            }

            return {
                isAvailabilityConfirmationOpen: open,
                availabilityConfirmationId: open ? state.availabilityConfirmationId : null
            }
        })
    },
    availabilityConfirmationId: null,
    setAvailabilityConfirmationId: (id) => {
        set({
            availabilityConfirmationId: id,
            isAvailabilityConfirmationOpen: id === null ? false : true
        })
    },
}))
