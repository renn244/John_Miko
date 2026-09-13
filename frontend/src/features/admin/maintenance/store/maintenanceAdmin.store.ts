import { create } from 'zustand';

type maintenanceStore = {
    isSearchOpen: boolean;
    setIsSearchOpen: (isOpen: boolean) => void;

    isCompleteOpen: boolean;
    setIsCompleteOpen: (isOpen: boolean) => void;
    completeId: string | undefined;
    setCompleteId: (id: string | undefined) => void;
}

export const useMaintenanceStore = create<maintenanceStore>((set) => ({
    isSearchOpen: false,
    setIsSearchOpen: (open) => {
        set({
            isSearchOpen: open,
        });
    },

    isCompleteOpen: false,
    setIsCompleteOpen: (open) => {
        set((state) => {
            return {
                isCompleteOpen: open,
                completeId: state.completeId,
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
