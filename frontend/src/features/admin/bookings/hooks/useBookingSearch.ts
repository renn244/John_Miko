import { updateSearchParams } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useBookingSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const paymentType = searchParams.get('paymentType') || undefined;
    const accommodationId = searchParams.get('accommodationId') || undefined;
    const bookingDate = searchParams.get('bookingDate') || undefined;
    const page = Number(searchParams.get('page') || 1);
    const limit = 10;

    const updateSearch = (newSearch: string) => 
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updateStatus = (newStatus: string | "all") => 
        updateSearchParams(setSearchParams, { status: newStatus === "all" ? undefined : newStatus, page: undefined });

    const updatePaymentType = (newPaymentType: string | "all") => 
        updateSearchParams(setSearchParams, { paymentType: newPaymentType === "all" ? undefined : newPaymentType, page: undefined });

    const updateAccommodationId = (newAccommodationId: string | "all") => 
        updateSearchParams(setSearchParams, { accommodationId: newAccommodationId === "all" ? undefined : newAccommodationId, page: undefined });
    

    const updateBookingDate = (newBookingDate: Date | undefined) => 
        updateSearchParams(setSearchParams, { bookingDate: newBookingDate?.toString(), page: undefined });

    const updatePage = (newPage: number) =>
        updateSearchParams(setSearchParams, { page: newPage === 1 ? undefined : newPage.toString() });

    const clearFilters = () => setSearchParams({})

    return {
        search,
        status,
        paymentType,
        accommodationId,
        bookingDate,
        page,
        limit,
        updateSearch,
        updateStatus,
        updatePaymentType,
        updateAccommodationId,
        updateBookingDate,
        updatePage,
        clearFilters
    }
}