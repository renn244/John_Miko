import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useBookingSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const paymentType = searchParams.get('paymentType') || undefined;
    const accommodationId = searchParams.get('accommodationId') || undefined;
    const bookingDate = searchParams.get('bookingDate') || undefined;

    const updateSearch = (newSearch: string) => 
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);

    const updateStatus = (newStatus: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'status', newStatus === "all" ? undefined : newStatus);

    const updatePaymentType = (newPaymentType: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'paymentType', newPaymentType === "all" ? undefined : newPaymentType);

    const updateAccommodationId = (newAccommodationId: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'accommodationId', newAccommodationId === "all" ? undefined : newAccommodationId);

    const updateBookingDate = (newBookingDate: Date | undefined) => 
        updateSearchParam(searchParams, setSearchParams, 'bookingDate', newBookingDate?.toString());

    const clearFilters = () => setSearchParams({})

    return {
        search,
        status,
        paymentType,
        accommodationId,
        bookingDate,
        updateSearch,
        updateStatus,
        updatePaymentType,
        updateAccommodationId,
        updateBookingDate,
        clearFilters
    }
}