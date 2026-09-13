import apiClient from "@/lib/apiClient";
import type { AddOnService } from "@/features/shared/add-on-services/types/add-on-service.type";

export type GetAvailableServicesForBookingQuery = {
    bookingDate: string;
    stayOptionId: string;
};

export const addOnServiceApi = {
    getAvailableServicesForBooking: async (query: GetAvailableServicesForBookingQuery) => {
        const response = await apiClient.get("/services/available", { params: query });

        if (response.status >= 400) {
            throw new Error(response.data.message || "Failed to fetch available add-on services");
        }

        return response.data as AddOnService[];
    },
};
