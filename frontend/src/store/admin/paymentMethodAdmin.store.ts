import { create } from "zustand";

type paymentMethodAdminStore = {
    // create patyment methods
    isCreateOpen: boolean;
    setIsCreateOpen: (open: boolean) => void;

    // edit payment methods
    isEditOpen: boolean;
    setIsEditOpen: (open: boolean) => void;
    editId: string | null;
    setEditId: (methodId: string | null) => void;

    // delete payment methods
    isDeleteOpen: boolean;
    setIsDeleteOpen: (open: boolean) => void;
    deleteId: string | null;
    setDeleteId: (methodId: string | null) => void;
}

export const paymentMethodAdminStore = create<paymentMethodAdminStore>((set) => ({
    isCreateOpen: false,
    setIsCreateOpen: (open) => {
        set({ isCreateOpen: open })
    },

    isEditOpen: false,
    setIsEditOpen: (open) => {
        set((state) => {
            if(open && state.editId === null) {
                console.warn("Cannot open without editId")
                return state
            }

            return {
                isEditOpen: open,
                editId: open ? state.editId : null
            }
        })
    },
    editId: null,
    setEditId: (id) => {
        set({
            editId: id,
            isEditOpen: id === null ? false : true
        })
    },

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
    }
}))