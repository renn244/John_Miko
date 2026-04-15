import { create } from "zustand";

type ChatbotAdminStore = {
    isViewOpen: boolean;
    setIsViewOpen: (isOpen: boolean) => void;
    viewId: string  | undefined;
    setViewId: (id: string | undefined) => void;

    isDeleteOpen: boolean;
    setIsDeleteOpen: (isOpen: boolean) => void;
    deleteId: string | undefined;
    setDeleteId: (id: string | undefined) => void;
}

export const useChatbotAdminStore = create<ChatbotAdminStore>((set) => ({
    isViewOpen: false,
    setIsViewOpen: (isOpen) => {
        set((state) => {
            if(isOpen && state.viewId === undefined) {
                console.warn("Cannot open view without viewId");
                return state;
            }

            return { 
                isViewOpen: isOpen,
                viewId: isOpen ? state.viewId : undefined,
            };
        })
    },
    viewId: undefined,
    setViewId: (id) => {
        set({
            viewId: id,
            isViewOpen: id === undefined ? false : true,
        })
    },

    isDeleteOpen: false,
    setIsDeleteOpen: (isOpen) => {
        set((state) => {
            if(isOpen && state.deleteId === undefined) {
                console.warn("Cannot open delete without deleteId");
                return state;
            }

            return { 
                isDeleteOpen: isOpen,
                deleteId: isOpen ? state.deleteId : undefined,
            };
        })  
    },
    deleteId: undefined,
    setDeleteId: (id) => {
        set({
            deleteId: id,
            isDeleteOpen: id === undefined ? false : true,
        })
    },
}))