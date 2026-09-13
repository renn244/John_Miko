import { updateSearchParams } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useMaintenanceSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;

    const updateSearch = (newSearch: string) => 
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updateStatus = (newStatus: string | "all") => 
        updateSearchParams(setSearchParams, { status: newStatus === "all" ? undefined : newStatus, page: undefined });

    const updatePriority = (newPriority: string | "all") => 
        updateSearchParams(setSearchParams, { priority: newPriority === "all" ? undefined : newPriority, page: undefined });

    const updatePage = (newPage: number) => 
        updateSearchParams(setSearchParams, { page: newPage.toString() });

    const clearFilters = () => setSearchParams({})

    return {
        search,
        status,
        priority,
        page,
        limit,
        updateSearch,
        updateStatus,
        updatePriority,
        updatePage,
        clearFilters
    }
}