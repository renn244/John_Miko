import { updateSearchParams } from "@/lib/updateSearchParams";
import type { GuestStatus } from "@/features/admin/guest-management/types/guest-management.type";
import { useSearchParams } from "react-router";

export const useGuestManagementSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') || undefined) as GuestStatus | undefined;
    const page = Number(searchParams.get('page') || 1);
    const limit = 10;

    const updateSearch = (newSearch: string) =>
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updateStatus = (newStatus: string | "all") =>
        updateSearchParams(setSearchParams, { status: newStatus === "all" ? undefined : newStatus, page: undefined });

    const updatePage = (newPage: number) =>
        updateSearchParams(setSearchParams, { page: newPage.toString() });

    const clearFilters = () => setSearchParams({});

    return {
        search,
        status,
        page,
        limit,
        updateSearch,
        updateStatus,
        updatePage,
        clearFilters
    }
}
