import apiClient from "@/lib/apiClient";
import type { AddOnService } from "@/types/admin/add-on-service.type";

export type GetAvailableServicesForBookingQuery = {
    bookingDate: string;
    timeSlot: "OverNight" | "DayStay";
};

export const addOnServiceApi = {
    getAvailableServicesForBooking: async (query: GetAvailableServicesForBookingQuery) => {
        // NOTE: Backend route is nested under /services controller:
        // @Controller('services') + @Get('services/available') => /services/services/available
        const response = await apiClient.get("/services/available", { params: query });

        if (response.status >= 400) {
            throw new Error(response.data.message || "Failed to fetch available add-on services");
        }

        return response.data as AddOnService[];
    },
};
