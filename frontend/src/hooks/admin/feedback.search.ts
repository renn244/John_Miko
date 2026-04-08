import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useFeedbackSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') || undefined;

    const updateSearch = (newSearch: string) => 
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);
    
    const updatePage = (newPage: string) => 
        updateSearchParam(searchParams, setSearchParams, 'page', newPage);

    const clearFilters = () => setSearchParams({})

    return {
        search,
        page,
        updateSearch,
        updatePage,
        clearFilters
    }
}