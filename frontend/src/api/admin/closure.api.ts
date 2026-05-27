import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { BookingForClosure, Closure, CreateClosureDto } from "@/types/admin/closure.type";

export const closureApi = {
    createClosure: async (data: CreateClosureDto) => {
        const response = await apiClient.post("/closure", data);

        if (response.status === 400) {
            throw new ValidationError(response.data);
        }

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while creating the closure.");
        }

        return response.data as Closure;
    },

    // getting the existing bookings for checking for closures
    getBookingForClosure: async (accommodationId?: string) => {
        const response = await apiClient.get(`/booking/closure`, {
            params: {
                accommodationId
            }
        })

        if(response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while fetching bookings for closure.");
        }

        return response.data as BookingForClosure[]; 
    },

    // getting the closure it self
    // if no accommodationId is provided, it will return resort closures, 
    getClosuresByAccommodationId: async (accommodationId?: string) => {
        const response = await apiClient.get(`/closure`, {
            params: { accommodationId }
        });

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while fetching closures.");
        }

        return response.data as Closure[];
    },

    deleteClosure: async (closureId: string) => {
        const response = await apiClient.delete(`/closure/${closureId}`);

        if (response.status >= 400) {
            throw new Error(response.data.message || "An error occurred while deleting the closure.");
        }

        return response.data as Closure;
    },
};
