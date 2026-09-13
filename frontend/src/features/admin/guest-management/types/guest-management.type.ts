import type { PaginationParams } from "@/types/pagination.type";

export type GuestStatus = "ACTIVE" | "INACTIVE";

export type GuestUser = {
    id: string;
    name: string | null;
    email: string;
    contactNo: string;
    role: "GUEST";
    status: GuestStatus;
    createdAt: string;
    bookingCount: number;
}

export type GetGuestsQuery = {
    search?: string;
    status?: GuestStatus;
} & PaginationParams
