import { closureApi } from "@/api/admin/closure.api";
import type { CreateClosureDto } from "@/types/admin/closure.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetClosuresQuery = (mode: 'withGlobal' | 'specific', accommodationId?: string) => {
    return useQuery({
        queryKey: ["closure", "get", mode, accommodationId],
        queryFn: () => closureApi.getClosuresByAccommodationId(mode, accommodationId),
        refetchOnWindowFocus: false,
    });
};

export const useGetClosureByDate = (accommodationId: string | undefined, date?: string) => {
    return useQuery({
        queryKey: ['closure', 'get', 'byDate', accommodationId, date],
        queryFn: () => closureApi.getClosureByDate(accommodationId ?? undefined, date!),
        enabled: !!date,
        refetchOnWindowFocus: false
    })
}

export const useGetClosureForBookingQuery = (accommodationId?: string) => {
    return useQuery({
        queryKey: ["closure", "getForBooking", accommodationId],
        queryFn: () => closureApi.getBookingForClosure(accommodationId),
        refetchOnWindowFocus: false
    })
}

export const useCreateClosureMutation = (accommodationId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["closure", "create", accommodationId],
        mutationFn: (data: CreateClosureDto) => closureApi.createClosure(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["closure", "get", accommodationId] });
        },
    });
};

export const useDeleteClosureMutation = (accommodationId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["closure", "delete", accommodationId],
        mutationFn: (closureId: string) => closureApi.deleteClosure(closureId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["closure", "get", accommodationId] });
        },
    });
};
