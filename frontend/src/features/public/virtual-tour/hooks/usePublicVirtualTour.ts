import { virtualTourApi } from "@/features/public/virtual-tour/api/virtual-tour.api";
import { useQuery } from "@tanstack/react-query";

export const useGetPublicVirtualTourQuery = () =>
    useQuery({
        queryKey: ["virtual-tour", "public"],
        queryFn: virtualTourApi.getVirtualTour,
        retry: 1,
        refetchOnWindowFocus: false,
    });
