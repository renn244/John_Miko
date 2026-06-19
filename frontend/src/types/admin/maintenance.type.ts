import type { PaginationParams } from "../pagination.type";
import type { MaintenanceExpertise } from "./staff-management.type";

export type Maintenance = {
    id: string;
    title: string;
    description: string;
    imagesUrl: string[];
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'InProgress' | 'Completed' | 'Closed';
    expertise: MaintenanceExpertise;
    assignedToId?: string | null;
    assignedTo?: {
        id: string;
        name?: string | null;
        email: string;
        expertise?: MaintenanceExpertise | null;
    } | null;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    resolutionNotes?: string;
    resolutionProofImages?: string[];
}

export type CreateMaintenanceDto = {
    title: Maintenance['title'];
    description: Maintenance['description'];
    imagesUrl?: Maintenance['imagesUrl'];
    priority: Maintenance['priority'];
    expertise: Maintenance['expertise'];
}

export type UpdateMaintenanceDto = CreateMaintenanceDto;

export type CompleteMaintenanceDto = {
    resolutionNotes: string;
    resolutionProofImages: string[];
}

export type GetMaintenancesQuery = {
    search?: string;
    status?: Maintenance['status'];
    priority?: Maintenance['priority'];
} & PaginationParams

export type GetMaintenanceStats = {
    total: number;
    Pending: number;
    InProgress: number;
    Completed: number;
    Closed: number;
}
