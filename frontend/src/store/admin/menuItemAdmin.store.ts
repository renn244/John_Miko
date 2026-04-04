import { create } from "zustand";

type menuItemAdminStore = {
    isDeleteOpen: boolean;
    setIsDeleteOpen: (open: boolean) => void;
    deleteId: string | undefined;
    setDeleteId: (id: string | undefined) => void;

    isAvailabilityConfirmationOpen: boolean;
    setIsAvailabilityConfirmationOpen: (open: boolean) => void;
    availabilityConfirmationId: string | undefined;
    setAvailabilityConfirmationId: (id: string | undefined) => void;
}

export const useMenuItemAdminStore = create<menuItemAdminStore>((set) => ({
    isDeleteOpen: false,
    setIsDeleteOpen: (open) => {
        set((state) => {
            if (open && state.deleteId === undefined) {
                console.warn("Cannot open without deleteId");
                return state;
            }

            return {
                isDeleteOpen: open,
                deleteId: open ? state.deleteId : undefined,
            };
        })
    },
    deleteId: undefined,
    setDeleteId: (id) => {
        set({
            deleteId: id,
            isDeleteOpen: id === undefined ? false : true,
        });
    },
    
    isAvailabilityConfirmationOpen: false,
    setIsAvailabilityConfirmationOpen: (open) => {
        set((state) => {
            if (open && state.availabilityConfirmationId === undefined) {
                console.warn("Cannot open without availabilityConfirmationId");
                return state;
            }

            return {
                isAvailabilityConfirmationOpen: open,
                availabilityConfirmationId: open ? state.availabilityConfirmationId : undefined,
            };
        })
    },
    availabilityConfirmationId: undefined,
    setAvailabilityConfirmationId: (id) => {
        set({
            availabilityConfirmationId: id,
            isAvailabilityConfirmationOpen: id === undefined ? false : true,
        });
    },
}))