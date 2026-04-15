import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useChatbotRuleSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;

    const updateSearch = (newSearch: string) => 
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);

    const clearFilters = () => setSearchParams({});
    
    return {
        search,
        updateSearch,
        clearFilters
    }
}