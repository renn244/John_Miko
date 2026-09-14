import { addOnServiceApi, type GetAvailableServicesForBookingQuery } from "@/features/shared/add-on-services/api/add-on-service.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailableServicesForBookingQuery = (query: GetAvailableServicesForBookingQuery | null) => {
    return useQuery({
        queryKey: ["add-on-service", "available", query],
        queryFn: () => addOnServiceApi.getAvailableServicesForBooking(query!),
        enabled: !!query,
        refetchOnWindowFocus: false,
    });
};
