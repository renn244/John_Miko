import type { PaginationParams } from "../pagination.type";

export type StaffRole = "KITCHEN_STAFF" | "RESORT_STAFF";
export type StaffStatus = "ACTIVE" | "INACTIVE";

export type StaffUser = {
    id: string;
    name: string | null;
    email: string;
    contactNo: string;
    role: StaffRole;
    status: StaffStatus;
    createdAt: string;
}

export type CreateStaffDto = {
    name: string;
    email: string;
    contactNo: string;
    role: StaffRole;
}

export type UpdateStaffRoleDto = {
    role: StaffRole;
}

export type GetStaffsQuery = {
    search?: string;
    role?: StaffRole;
    status?: StaffStatus;
} & PaginationParams

export type StaffStats = {
    total: number;
    active: number;
    inactive: number;
    kitchen: number;
    resort: number;
}
