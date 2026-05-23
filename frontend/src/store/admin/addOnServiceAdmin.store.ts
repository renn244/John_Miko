import { create } from "zustand";

type AddOnServiceAdminStore = {
    isDeleteOpen: boolean;
    setIsDeleteOpen: (open: boolean) => void;
    deleteId: string | undefined;
    setDeleteId: (id: string | undefined) => void;
};

export const useAddOnServiceAdminStore = create<AddOnServiceAdminStore>((set) => ({
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
