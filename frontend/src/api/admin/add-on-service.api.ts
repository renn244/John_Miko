import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type {
    AddOnService,
    AddOnServiceStats,
    CreateAddOnServiceDto,
    GetAddOnServicesQuery,
    UpdateAddOnServiceAvailabilityDto,
    UpdateAddOnServiceDto,
} from "@/types/admin/add-on-service.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const addOnServiceApi = {
    createAddOnService: async (data: CreateAddOnServiceDto) => {
        const response = await apiClient.post("/services", data);

        if (response.status === 400) {
            throw new ValidationError(response.data);
        }

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while creating the add-on service.");
        }

        return response.data as AddOnService;
    },

    getAddOnServices: async (query: GetAddOnServicesQuery) => {
        const response = await apiClient.get("/services", { params: query });

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while fetching add-on services.");
        }

        return response.data as PaginatedResponse<AddOnService>;
    },

    getAddOnServiceStats: async () => {
        const response = await apiClient.get("/services/stats");

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while fetching add-on service stats.");
        }

        return response.data as AddOnServiceStats;
    },

    getAddOnServiceById: async (id: string) => {
        const response = await apiClient.get(`/services/${id}`);

        if (response.status === 404) {
            return null;
        }

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while fetching the add-on service.");
        }

        return response.data as AddOnService;
    },

    updateAddOnService: async (id: string, data: UpdateAddOnServiceDto) => {
        const response = await apiClient.patch(`/services/${id}`, data);

        if (response.status === 400) {
            throw new ValidationError(response.data);
        }

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while updating the add-on service.");
        }

        return response.data as AddOnService;
    },

    updateAddOnServiceAvailability: async (id: string, data: UpdateAddOnServiceAvailabilityDto) => {
        const response = await apiClient.patch(`/services/availability/${id}`, data);

        if (response.status === 400) {
            throw new ValidationError(response.data);
        }

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while updating add-on service availability.");
        }

        return response.data as AddOnService;
    },

    deleteAddOnService: async (id: string) => {
        const response = await apiClient.delete(`/services/${id}`);

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while deleting the add-on service.");
        }

        return response.data as AddOnService;
    },
};
