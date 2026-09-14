import apiClient from "@/lib/apiClient";
import type { Accommodation, AccommodationOption, GetAccommodationQuery } from "@/features/shared/accommodations/types/accommodation.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const accommodationApi = {
    getAccommodationOptions: async () => {
        const response = await apiClient.get('/accommodation/options');

        if(response.status >= 400) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data as AccommodationOption[];
    },
    getAccommodations: async (query?: GetAccommodationQuery) => {
        const response = await apiClient.get('/accommodation', { params: query });
        
        if(response.status >= 400) {
            throw new Error(response.data.message || "Validation error");
        }

        return response.data as PaginatedResponse<Accommodation>;
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
}
