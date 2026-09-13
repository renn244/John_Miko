import { adminAccommodationApi } from "@/features/admin/accommodations/api/adminAccommodation.api";
import type { Accommodation, GetAccommodationQuery, UpdateAccommodationDto } from "@/features/shared/accommodations/types/accommodation.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateAccommodationMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminAccommodationApi.createAccommodation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            navigate('/admin/accommodation');
        }
    })
}

export const useGetAccommodationStatsQuery = () => {
    return useQuery({
        queryKey: ['accommodation-stats'],
        queryFn: adminAccommodationApi.getAccommodationStats,
        refetchOnWindowFocus: false
    })
}

export const useGetRetiredAccommodationsQuery = (query?: GetAccommodationQuery, enabled = true) => useQuery({
    queryKey: ['accommodations', 'retired', query],
    queryFn: () => adminAccommodationApi.getRetiredAccommodations(query),
    enabled,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
});

export const useUpdateAccommodationMutation = (id: Accommodation['id']) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: UpdateAccommodationDto) => 
            adminAccommodationApi.updateAccommodation(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            queryClient.invalidateQueries({ queryKey: ['accommodation', data.id] });

            navigate('/admin/accommodation');
        }
    })
}

export const useRetireAccommodationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminAccommodationApi.deleteAccommodation,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            queryClient.invalidateQueries({ queryKey: ['accommodation', id] });
        }
    })
}

export const useRestoreAccommodationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminAccommodationApi.restoreAccommodation,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accommodations'] }),
    });
}
