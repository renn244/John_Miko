import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { Accommodation, AccommodationStats, CreateAccommodationDto, GetAccommodationQuery, UpdateAccommodationDto } from "@/features/shared/accommodations/types/accommodation.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const adminAccommodationApi = {
    createAccommodation: async (data: CreateAccommodationDto) => {
        const response = await apiClient.post('/accommodation', data);

        if(response.status === 400) {
            throw new ValidationError(response.data || "Validation error");
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data as Accommodation;
    },
    getAccommodationStats: async () => {
        const response = await apiClient.get('/accommodation/stats');

        if(response.status >= 400) {
            throw new Error(response.data.message || "Unexpected error")
        }
        
        return response.data as AccommodationStats;
    },
    getRetiredAccommodations: async (query?: GetAccommodationQuery) => {
        const response = await apiClient.get('/accommodation/retired', { params: query });
        if (response.status >= 400) throw new Error(response.data.message || 'Failed to fetch retired accommodations');
        return response.data as PaginatedResponse<Accommodation>;
    },
    updateAccommodation: async (id: Accommodation['id'], data: UpdateAccommodationDto) => {
        const response = await apiClient.patch(`/accommodation/${id}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || "Unexpected error");
        }

        return response.data as Accommodation;
    },
    deleteAccommodation: async (id: Accommodation['id']) => {
        const response = await apiClient.delete(`/accommodation/${id}`);

        if(response.status >= 400) {
            throw new Error(response.data.message || "Unexpected error");
        }

        return response.data as Accommodation;
    },
    restoreAccommodation: async (id: Accommodation['id']) => {
        const response = await apiClient.patch(`/accommodation/${id}/restore`);
        if (response.status >= 400) throw new Error(response.data.message || 'Unable to restore accommodation');
        return response.data as Accommodation;
    },
}
