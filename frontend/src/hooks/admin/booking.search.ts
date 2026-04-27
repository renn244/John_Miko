import { updateSearchParam } from "@/lib/updateSearchParams";
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

    const updateSearch = (newSearch: string) => {
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);
        updatePage(1);
    }

    const updateStatus = (newStatus: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'status', newStatus === "all" ? undefined : newStatus);
        updatePage(1);
    } 

    const updatePaymentType = (newPaymentType: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'paymentType', newPaymentType === "all" ? undefined : newPaymentType);
        updatePage(1);
    } 

    const updateAccommodationId = (newAccommodationId: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'accommodationId', newAccommodationId === "all" ? undefined : newAccommodationId);
        updatePage(1);
    }

    const updateBookingDate = (newBookingDate: Date | undefined) => {
        updateSearchParam(searchParams, setSearchParams, 'bookingDate', newBookingDate?.toString());
        updatePage(1);
    }

    const updatePage = (newPage: number) =>
        updateSearchParam(searchParams, setSearchParams, 'page', newPage === 1 ? undefined : newPage.toString());

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