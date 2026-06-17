import { create } from 'zustand';

type maintenanceStore = {
    isViewOpen: boolean;
    setIsViewOpen: (isOpen: boolean) => void;
    viewId: string | undefined;
    setViewId: (id: string | undefined) => void;

    isSearchOpen: boolean;
    setIsSearchOpen: (isOpen: boolean) => void;

    isCompleteOpen: boolean;
    setIsCompleteOpen: (isOpen: boolean) => void;
    completeId: string | undefined;
    setCompleteId: (id: string | undefined) => void;
}

export const useMaintenanceStore = create<maintenanceStore>((set) => ({
    isViewOpen: false,
    setIsViewOpen: (open) => {
        set((state) => {
            if(open && state.viewId === undefined) {
                console.warn("Cannot open without viewId");
                return state;
            }

            return {
                isViewOpen: open,
                viewId: open ? state.viewId : undefined,
            }
        });
    },
    viewId: undefined,
    setViewId: (id) => {
        set({
            viewId: id,
            isViewOpen: !!id,
        });
    },

    isSearchOpen: false,
    setIsSearchOpen: (open) => {
        set({
            isSearchOpen: open,
        });
    },

    isCompleteOpen: false,
    setIsCompleteOpen: (open) => {
        set((state) => {
            if (!open) {
                return {
                    isCompleteOpen: false,
                    completeId: undefined,
                };
            }
            
            return {
                isCompleteOpen: true,
                completeId: open ? state.completeId : undefined,
            };
        });
    },
    completeId: undefined,
    setCompleteId: (id) => {
        set({
            completeId: id,
            isCompleteOpen: !!id,
        });
    },
}))
