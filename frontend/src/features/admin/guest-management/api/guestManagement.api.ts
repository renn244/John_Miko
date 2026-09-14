import apiClient from "@/lib/apiClient";
import type { GetGuestsQuery, GuestUser } from "@/features/admin/guest-management/types/guest-management.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const guestManagementApi = {
    getGuests: async (query: GetGuestsQuery) => {
        const response = await apiClient.get('/guest-management', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching guest users.');
        }

        return response.data as PaginatedResponse<GuestUser>;
    },
    getGuestById: async (id: string) => {
        const response = await apiClient.get(`/guest-management/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the guest user.');
        }

        return response.data as GuestUser;
    },
    deactivateGuest: async (id: string) => {
        const response = await apiClient.patch(`/guest-management/${id}/deactivate`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while deactivating the guest user.');
        }

        return response.data as GuestUser;
    },
    reactivateGuest: async (id: string) => {
        const response = await apiClient.patch(`/guest-management/${id}/reactivate`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while reactivating the guest user.');
        }

        return response.data as GuestUser;
    }
}
