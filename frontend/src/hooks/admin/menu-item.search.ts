import { updateSearchParam } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useMenuItemSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const availability = searchParams.get('availability') || undefined;

    const updateSearch = (newSearch: string) => 
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);

    const updateCategory = (newCategory: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'category', newCategory === "all" ? undefined : newCategory);

    const updateAvailability = (newAvailability: string | "all") => 
        updateSearchParam(searchParams, setSearchParams, 'availability', newAvailability === "all" ? undefined : newAvailability);

    const clearFilters = () => setSearchParams({})

    return {
        search,
        category,
        availability,
        updateSearch,
        updateCategory,
        updateAvailability,
        clearFilters
    }
}