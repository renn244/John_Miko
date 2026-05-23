import { updateSearchParams } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useAddOnServiceSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = 8;

    const updateSearch = (newSearch: string) =>
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updatePage = (newPage: number) =>
        updateSearchParams(setSearchParams, { page: newPage === 1 ? undefined : newPage.toString() });

    const clearFilters = () => setSearchParams({});

    return {
        search,
        page,
        limit,
        updateSearch,
        updatePage,
        clearFilters,
    };
};
