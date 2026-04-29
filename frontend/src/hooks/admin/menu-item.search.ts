import { updateSearchParams } from "@/lib/updateSearchParams";
import type { MenuItem } from "@/types/admin/menu-item.type";
import { useSearchParams } from "react-router";

export const useMenuItemSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const availability = (searchParams.get('availability') || undefined) as MenuItem['availability'];
    const page = Number(searchParams.get('page') || 1);
    const limit = 8;

    const updateSearch = (newSearch: string) => 
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updateCategory = (newCategory: string | "all") => 
        updateSearchParams(setSearchParams, { category: newCategory === "all" ? undefined : newCategory, page: undefined });

    const updateAvailability = (newAvailability: string | "all") => 
        updateSearchParams(setSearchParams, { availability: newAvailability === "all" ? undefined : newAvailability, page: undefined });

    const updatePage = (newPage: number) => 
        updateSearchParams(setSearchParams, { page: newPage === 1 ? undefined : newPage.toString() });

    const clearFilters = () => setSearchParams({})

    return {
        search,
        category ,
        availability,
        page,
        limit,
        updateSearch,
        updateCategory,
        updateAvailability,
        updatePage,
        clearFilters
    }
}