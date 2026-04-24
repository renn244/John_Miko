import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useMaintenanceSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;

    const updateSearch = (newSearch: string) => 
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);

    const updateStatus = (newStatus: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'status', newStatus === "all" ? undefined : newStatus);

    const updatePriority = (newPriority: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'priority', newPriority === "all" ? undefined : newPriority);

    const clearFilters = () => setSearchParams({})

    return {
        search,
        status,
        priority,
        updateSearch,
        updateStatus,
        updatePriority,
        clearFilters
    }
}