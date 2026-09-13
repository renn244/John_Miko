import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { CompleteMaintenanceDto, CreateMaintenanceDto, GetMaintenancesQuery, GetMaintenanceStats, Maintenance, MaintenanceOverview, UpdateMaintenanceDto } from "@/features/admin/maintenance/types/maintenance.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const maintenanceApi = {
    createMaintenance: async (data: CreateMaintenanceDto) => {
        const response = await apiClient.post('/maintenance', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while creating the maintenance ticket.');
        }

        return response.data as Maintenance;
    },
    getMaintenances: async (query: GetMaintenancesQuery) => {
        const response = await apiClient.get('/maintenance', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching maintenance tickets.');
        }

        return response.data as PaginatedResponse<Maintenance>;
    },
    getMaintenanceStats: async () => {
        const response = await apiClient.get('/maintenance/stats');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching maintenance stats.');
        }

        return response.data as GetMaintenanceStats;
    },
    getMaintenanceOverview: async (date?: string) => {
        const response = await apiClient.get('/maintenance/overview', {
            params: { date },
        });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching maintenance overview.');
        }

        return response.data as MaintenanceOverview;
    },
    getMaintenanceById: async (id: string) => {
        const response = await apiClient.get(`/maintenance/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the maintenance ticket.');
        }

        return response.data as Maintenance;
    },
    updateMaintenance: async (id: string, data: UpdateMaintenanceDto) => {
        const response = await apiClient.patch(`/maintenance/${id}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating the maintenance ticket.');
        }

        return response.data as Maintenance;
    },
    startMaintenance: async (id: string) => {
        const response = await apiClient.patch(`/maintenance/${id}/start`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while starting the maintenance ticket.');
        }

        return response.data as Maintenance;
    },
    completeMaintenance: async (id: string, data: CompleteMaintenanceDto) => {
        const response = await apiClient.patch(`/maintenance/${id}/complete`, data);
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while resolving the maintenance ticket.');
        }

        return response.data as Maintenance;
    },
    reopenMaintenance: async (id: string) => {
        const response = await apiClient.patch(`/maintenance/${id}/reopen`);
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while reopening the maintenance ticket.');
        }

        return response.data as Maintenance;        
    }
}
