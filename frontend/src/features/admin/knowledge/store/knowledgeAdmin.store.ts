import { create } from "zustand";

type KnowledgeAdminStore = {
    selectedDocumentId: string | undefined;
    newDocumentVersion: number;
    selectDocument: (id: string | undefined) => void;
    startNewDocument: () => void;

    isDeleteOpen: boolean;
    deleteDocumentId: string | undefined;
    setIsDeleteOpen: (open: boolean) => void;
    setDeleteDocumentId: (id: string | undefined) => void;
    completeDelete: () => void;
};

export const useKnowledgeAdminStore = create<KnowledgeAdminStore>((set) => ({
    selectedDocumentId: undefined,
    newDocumentVersion: 0,
    selectDocument: (id) => set({ selectedDocumentId: id }),
    startNewDocument: () => {
        set((state) => ({
            selectedDocumentId: undefined,
            newDocumentVersion: state.newDocumentVersion + 1,
        }));
    },

    isDeleteOpen: false,
    deleteDocumentId: undefined,
    setIsDeleteOpen: (open) => {
        set((state) => {
            if (open && state.deleteDocumentId === undefined) {
                console.warn("Cannot open without deleteDocumentId");
                return state;
            }

            return {
                isDeleteOpen: open,
                deleteDocumentId: state.deleteDocumentId,
            };
        });
    },
    setDeleteDocumentId: (id) => {
        set({
            deleteDocumentId: id,
            isDeleteOpen: id !== undefined,
        });
    },
    completeDelete: () => {
        set((state) => ({
            selectedDocumentId: undefined,
            newDocumentVersion: state.newDocumentVersion + 1,
            deleteDocumentId: undefined,
            isDeleteOpen: false,
        }));
    },
}));
