import { create } from "zustand";

type accommodation = {
    id: string;
    name: string;
};

// null means the resort closure dialog is open, otherwise it's an accommodation closure
type ClosureAdminState = {
    accommodation: accommodation | null;
    isClosureOpen: boolean;

    setClosureOpen: (
        open: boolean,
        param?: accommodation | null
    ) => void;
};

export const useClosureAdminStore = create<ClosureAdminState>((set) => ({
    accommodation: null,
    isClosureOpen: false,

    setClosureOpen: (open: boolean, param?: accommodation | null) =>
        set({
            isClosureOpen: open,
            accommodation: open ? (param ?? null) : null,
        }),
}));
