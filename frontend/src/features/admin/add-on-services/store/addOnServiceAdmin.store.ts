import { create } from "zustand";

type AddOnServiceAdminStore = {
    isAvailabilityOpen: boolean;
    setIsAvailabilityOpen: (open: boolean) => void;
    availabilityId: string | undefined;
    setAvailabilityId: (id: string | undefined) => void;
    isDeleteOpen: boolean;
    setIsDeleteOpen: (open: boolean) => void;
    deleteId: string | undefined;
    setDeleteId: (id: string | undefined) => void;
};

export const useAddOnServiceAdminStore = create<AddOnServiceAdminStore>((set) => ({
    isAvailabilityOpen: false,
    setIsAvailabilityOpen: (open) => {
        set((state) => {
            if (open && state.availabilityId === undefined) {
                console.warn("Cannot open without availabilityId");
                return state;
            }

            return {
                isAvailabilityOpen: open,
                availabilityId: state.availabilityId,
            };
        });
    },
    availabilityId: undefined,
    setAvailabilityId: (id) => {
        set({
            availabilityId: id,
            isAvailabilityOpen: id === undefined ? false : true,
        });
    },
    isDeleteOpen: false,
    setIsDeleteOpen: (open) => {
        set((state) => {
            if (open && state.deleteId === undefined) {
                console.warn("Cannot open without deleteId");
                return state;
            }

            return {
                isDeleteOpen: open,
                deleteId: state.deleteId,
            };
        });
    },
    deleteId: undefined,
    setDeleteId: (id) => {
        set({
            deleteId: id,
            isDeleteOpen: id === undefined ? false : true,
        });
    },
}));
