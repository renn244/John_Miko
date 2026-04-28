import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useMaintenanceSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;

    const updateSearch = (newSearch: string) => {
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);
        updatePage(1);
    }

    const updateStatus = (newStatus: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'status', newStatus === "all" ? undefined : newStatus);
        updatePage(1);
    } 

    const updatePriority = (newPriority: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'priority', newPriority === "all" ? undefined : newPriority);
        updatePage(1);
    }

    const updatePage = (newPage: number) => 
        updateSearchParam(searchParams, setSearchParams, 'page', newPage.toString());

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