import { accommodationApi } from "@/api/admin/accommodation.api";
import type { Accommodation, GetAccommodationQuery, UpdateAccommodationDto } from "@/types/admin/accommodation.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateAccommodationMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accommodationApi.createAccommodation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            navigate('/admin/accommodation');
        }
    })
}

export const useGetAccommodationStatsQuery = () => {
    return useQuery({
        queryKey: ['accommodation-stats'],
        queryFn: accommodationApi.getAccommodationStats,
        refetchOnWindowFocus: false
    })
}

export const useGetAccommodationsQuery = (query: GetAccommodationQuery) =>{
    
    return useQuery({
        queryKey: ['accommodations', query],
        queryFn: () => accommodationApi.getAccommodations(query),
        refetchOnWindowFocus: false
    })
}

export const useGetAccommodationByIdQuery = (id: Accommodation['id'] | undefined) => {
    return useQuery({
        queryKey: ['accommodation', id],
        queryFn: () => accommodationApi.getAccommodationById(id || ""),
        refetchOnWindowFocus: false,
        enabled: !!id
    })
}

export const useUpdateAccommodationMutation = (id: Accommodation['id']) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: UpdateAccommodationDto) => 
            accommodationApi.updateAccommodation(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            queryClient.invalidateQueries({ queryKey: ['accommodation', data.id] });

            navigate('/admin/accommodation');
        }
    })
}

// there shouldn't be delete in accommodation
export const useDeleteAccommodationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accommodationApi.deleteAccommodation,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['accommodations'] });
            queryClient.invalidateQueries({ queryKey: ['accommodation', id] });
        }
    })
} 