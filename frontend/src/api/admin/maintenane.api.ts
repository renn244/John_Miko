import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";

export const maintenanceApi = {
    createMaintenance: async (data: any) => {
        const response = await apiClient.post('/maintenance', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while creating the maintenance ticket.');
        }

        return response.data as any;
    },
    getMaintenances: async (query: any) => {
        const response = await apiClient.get('/maintenance', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching maintenance tickets.');
        }

        return response.data as any[];
    },
    getMaintenanceStats: async () => {
        const response = await apiClient.get('/maintenance/stats');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching maintenance stats.');
        }

        return response.data as any;
    },
    getMaintenanceById: async (id: string) => {
        const response = await apiClient.get(`/maintenance/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the maintenance ticket.');
        }

        return response.data as any;
    },
    updateMaintenance: async (id: string, data: any) => {
        const response = await apiClient.patch(`/maintenance/${id}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating the maintenance ticket.');
        }

        return response.data as any;
    },
    startMaintenance: async (id: string) => {
        const response = await apiClient.patch(`/maintenance/${id}/start`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while starting the maintenance ticket.');
        }

        return response.data as any;
    },
    completeMaintenance: async (id: string, resolutionNotes: string) => {
        const response = await apiClient.patch(`/maintenance/${id}/complete`, { resolutionNotes: resolutionNotes });
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while resolving the maintenance ticket.');
        }

        return response.data as any;
    },
    closeMaintenance: async (id: string) => {
        const response = await apiClient.patch(`/maintenance/${id}/close`);
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while closing the maintenance ticket.');
        }

        return response.data as any
    }
}