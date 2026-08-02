import { create } from "zustand";

type guestManagementStore = {
    isViewOpen: boolean;
    setIsViewOpen: (open: boolean) => void;
    viewId: string | undefined;
    setViewId: (id: string | undefined) => void;

    isDeactivateOpen: boolean;
    setIsDeactivateOpen: (open: boolean) => void;
    deactivateId: string | undefined;
    setDeactivateId: (id: string | undefined) => void;

    isReactivateOpen: boolean;
    setIsReactivateOpen: (open: boolean) => void;
    reactivateId: string | undefined;
    setReactivateId: (id: string | undefined) => void;
}

export const useGuestManagementStore = create<guestManagementStore>((set) => ({
    isViewOpen: false,
    setIsViewOpen: (open) => {
        set((state) => {
            if (open && state.viewId === undefined) {
                console.warn("Cannot open without viewId");
                return state;
            }

            return {
                isViewOpen: open,
                viewId: state.viewId,
            };
        });
    },
    viewId: undefined,
    setViewId: (id) => {
        set({
            viewId: id,
            isViewOpen: id === undefined ? false : true,
        })
    },

    isDeactivateOpen: false,
    setIsDeactivateOpen: (open) => {
        set((state) => {
            if (open && state.deactivateId === undefined) {
                console.warn("Cannot open without deactivateId");
                return state;
            }

            return {
                isDeactivateOpen: open,
                deactivateId: state.deactivateId,
            };
        });
    },
    deactivateId: undefined,
    setDeactivateId: (id) => {
        set({
            deactivateId: id,
            isDeactivateOpen: id === undefined ? false : true,
        })
    },

    isReactivateOpen: false,
    setIsReactivateOpen: (open) => {
        set((state) => {
            if (open && state.reactivateId === undefined) {
                console.warn("Cannot open without reactivateId");
                return state;
            }

            return {
                isReactivateOpen: open,
                reactivateId: state.reactivateId,
            };
        });
    },
    reactivateId: undefined,
    setReactivateId: (id) => {
        set({
            reactivateId: id,
            isReactivateOpen: id === undefined ? false : true,
        })
    },
}))
