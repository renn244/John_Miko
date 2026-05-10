import { guestManagementApi } from "@/api/admin/guest-management.api";
import type { GetGuestsQuery } from "@/types/admin/guest-management.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetGuestsQuery = (query: GetGuestsQuery) => {
    return useQuery({
        queryKey: ['guest-management', 'list', query],
        queryFn: () => guestManagementApi.getGuests(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    });
}

export const useGetGuestById = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['guest-management', 'byId', id],
        queryFn: () => guestManagementApi.getGuestById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const useDeactivateGuestMutation = (id: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['guest-management', 'deactivate', id],
        mutationFn: () => guestManagementApi.deactivateGuest(id || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guest-management', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['guest-management', 'byId', id] });
        }
    })
}

export const useReactivateGuestMutation = (id: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['guest-management', 'reactivate', id],
        mutationFn: () => guestManagementApi.reactivateGuest(id || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guest-management', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['guest-management', 'byId', id] });
        }
    })
}
