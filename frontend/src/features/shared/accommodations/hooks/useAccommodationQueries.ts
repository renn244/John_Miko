import { accommodationApi } from "@/features/shared/accommodations/api/accommodation.api";
import type { Accommodation, GetAccommodationQuery } from "@/features/shared/accommodations/types/accommodation.type";
import { useQuery } from "@tanstack/react-query";

export const useGetAccommodationOptionsQuery = () => {
    return useQuery({
        queryKey: ['accommodation-options'],
        queryFn: accommodationApi.getAccommodationOptions,
        refetchOnWindowFocus: false
    })
}

export const useGetAccommodationsQuery = (query?: GetAccommodationQuery, enabled = true) =>{
    return useQuery({
        queryKey: ['accommodations', query],
        queryFn: () => accommodationApi.getAccommodations(query),
        enabled,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
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
