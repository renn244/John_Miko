import type { PaginationParams } from "../pagination.type";

export type Maintenance = {
    id: string;
    title: string;
    description: string;
    imagesUrl: string[];
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'InProgress' | 'Completed' | 'Closed';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    resolutionNotes?: string;
}

export type CreateMaintenanceDto = {
    title: Maintenance['title'];
    description: Maintenance['description'];
    imagesUrl?: Maintenance['imagesUrl'];
    priority: Maintenance['priority'];
}

export type UpdateMaintenanceDto = CreateMaintenanceDto;

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
