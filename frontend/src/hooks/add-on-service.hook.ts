import { addOnServiceApi, type GetAvailableServicesForBookingQuery } from "@/api/add-on-service.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailableServicesForBookingQuery = (query: GetAvailableServicesForBookingQuery | null) => {
    return useQuery({
        queryKey: ["add-on-service", "available", query],
        queryFn: () => addOnServiceApi.getAvailableServicesForBooking(query!),
        enabled: !!query,
        refetchOnWindowFocus: false,
    });
};
