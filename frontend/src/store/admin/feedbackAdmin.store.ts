import { create } from "zustand";

type feedbackAdminStore = {
    isViewOpen: boolean;
    setIsViewOpen: (isOpen: boolean) => void;
    viewId: string | undefined;
    setViewId: (id: string | undefined) => void;
}

export const useFeedbackAdminStore = create<feedbackAdminStore>((set) => ({
    isViewOpen: false,
    setIsViewOpen: (open) => {
        set((state) => {
            if(open && state.viewId === undefined) {
                console.warn("Cannot open without viewId");
                return state;
            }

            return {
                isViewOpen: open,
                viewId: state.viewId,
            }
        });
    },
    viewId: undefined,
    setViewId: (id) => {
        set({
            viewId: id,
            isViewOpen: id === undefined ? false : true,
        });
    },
}))
