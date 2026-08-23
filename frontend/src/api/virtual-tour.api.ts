import apiClient from "@/lib/apiClient";
import type { PublicVirtualTourResponse } from "@/types/virtual-tour.type";

export const virtualTourApi = {
    getVirtualTour: async () => {
        const response = await apiClient.get("/virtual-tour");

        if (response.status >= 400) {
            throw new Error(
                response.data.message || "Unable to load the virtual tour.",
            );
        }

        return response.data as PublicVirtualTourResponse;
    },
};
