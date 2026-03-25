import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { Accommodation, AccommodationOption, AccommodationStats, CreateAccommodationDto, GetAccommodationQuery, UpdateAccommodationDto } from "@/types/admin/accommodation.type";

export const accommodationApi = {
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
    getAccommodationOptions: async () => {
        const response = await apiClient.get('/accommodation/options');

        if(response.status >= 400) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data as AccommodationOption[];
    },
    getAccommodations: async (query: GetAccommodationQuery) => {
        const response = await apiClient.get('/accommodation', { params: query });
        
        if(response.status >= 400) {
            throw new Error(response.data.message || "Validation error");
        }

        return (response.data || []) as Accommodation[];
    },
    getAccommodationById: async (id: Accommodation['id']) => {
        const response = await apiClient.get(`/accommodation/${id}`);

        if(response.status === 404) {
            return null;
        }
        
        if(response.status >= 400) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data as Accommodation;
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
}