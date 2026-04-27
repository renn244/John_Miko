import { updateSearchParam } from "@/lib/updateSearchParams";
import type { MenuItem } from "@/types/admin/menu-item.type";
import { useSearchParams } from "react-router";

export const useMenuItemSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const availability = (searchParams.get('availability') || undefined) as MenuItem['availability'];
    const page = Number(searchParams.get('page') || 1);
    const limit = 8;

    const updateSearch = (newSearch: string) => {
        updateSearchParam(searchParams, setSearchParams, 'search', newSearch);
        updatePage(1);
    }

    const updateCategory = (newCategory: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'category', newCategory === "all" ? undefined : newCategory);
        updatePage(1);
    } 

    const updateAvailability = (newAvailability: string | "all") => {
        updateSearchParam(searchParams, setSearchParams, 'availability', newAvailability === "all" ? undefined : newAvailability);
        updatePage(1);
    }

    const updatePage = (newPage: number) => 
        updateSearchParam(searchParams, setSearchParams, 'page', newPage === 1 ? undefined : newPage.toString());

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