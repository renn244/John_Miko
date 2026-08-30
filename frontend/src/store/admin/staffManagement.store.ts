import { create } from "zustand";
import type { CreateStaffDto } from "@/types/admin/staff-management.type";

type staffManagementStore = {
    isChangeRoleOpen: boolean;
    setIsChangeRoleOpen: (open: boolean) => void;
    changeRoleId: string | undefined;
    setChangeRoleId: (id: string | undefined) => void;

    isDeactivateOpen: boolean;
    setIsDeactivateOpen: (open: boolean) => void;
    deactivateId: string | undefined;
    setDeactivateId: (id: string | undefined) => void;

    isReactivateOpen: boolean;
    setIsReactivateOpen: (open: boolean) => void;
    reactivateId: string | undefined;
    setReactivateId: (id: string | undefined) => void;

    isDeleteOpen: boolean;
    setIsDeleteOpen: (open: boolean) => void;
    deleteId: string | undefined;
    setDeleteId: (id: string | undefined) => void;

    restoreRequest: { staffId: string; data: CreateStaffDto } | undefined;
    setRestoreRequest: (request: { staffId: string; data: CreateStaffDto } | undefined) => void;
}

export const useStaffManagementStore = create<staffManagementStore>((set) => ({
    isChangeRoleOpen: false,
    setIsChangeRoleOpen: (open) => {
        set((state) => {
            if (open && state.changeRoleId === undefined) {
                console.warn("Cannot open without changeRoleId");
                return state;
            }

            return {
                isChangeRoleOpen: open,
                changeRoleId: state.changeRoleId,
            };
        });
    },
    changeRoleId: undefined,
    setChangeRoleId: (id) => {
        set({
            changeRoleId: id,
            isChangeRoleOpen: id === undefined ? false : true,
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
            isDeleteOpen: id !== undefined,
        })
    },

    restoreRequest: undefined,
    setRestoreRequest: (request) => set({ restoreRequest: request }),
}))
