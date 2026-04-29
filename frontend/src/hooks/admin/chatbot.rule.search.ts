import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useChatbotRuleSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const page = Number(searchParams.get('page') || "1");
    const limit = 10;

    const updateSearch = (newSearch: string) => {
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);
        updatePage(1);
    }

    const updatePage = (newPage: number) => 
        updateSearchParam(searchParams, setSearchParams, 'page', newPage.toString());

    const clearFilters = () => setSearchParams({});
    
    return {
        search,
        page,
        limit,
        updateSearch,
        updatePage,
        clearFilters
    }
}