import type { PaginationParams } from "../pagination.type";

export type StaffRole = "KITCHEN_STAFF" | "RESORT_STAFF" | "MAINTENANCE_STAFF";
export type StaffStatus = "ACTIVE" | "INACTIVE";
export type MaintenanceExpertise = "Electrical" | "Pool" | "Construction";

export type StaffUser = {
    id: string;
    name: string | null;
    email: string;
    contactNo: string;
    role: StaffRole;
    expertise?: MaintenanceExpertise | null;
    status: StaffStatus;
    createdAt: string;
}

export type CreateStaffDto = {
    name: string;
    email: string;
    contactNo: string;
    role: StaffRole;
    expertise?: MaintenanceExpertise;
}

export type UpdateStaffRoleDto = {
    role: StaffRole;
    expertise?: MaintenanceExpertise;
}

export type GetStaffsQuery = {
    search?: string;
    role?: StaffRole;
    status?: StaffStatus;
} & PaginationParams

export type StaffStats = {
    total: number;
    kitchen: number;
    resort: number;
    maintenance: number;
}
