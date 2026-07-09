import { updateSearchParams } from "@/lib/updateSearchParams";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { useSearchParams } from "react-router";

export const useAccommodationSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type");
    const page = Number(searchParams.get("page") || "1");
    const limit = 8;

    const updateSearch = (value: string) => 
        updateSearchParams(setSearchParams, { search: value || undefined, page: undefined });

    const updateType = (value: Accommodation['type'] | "all") => 
        updateSearchParams(setSearchParams, { type: value === "all" ? undefined : value, page: undefined });

    const updatePage = (value: number) => {
        updateSearchParams(setSearchParams, { page: value === 1 ? undefined : value.toString() });
    };

    const clearFilters = () => {
        updateSearchParams(setSearchParams, {
            search: undefined,
            type: undefined,
            page: undefined,
        });
    };

    return {
        search,
        type: type as Accommodation['type'],
        page,
        limit,
        updateSearch,
        updateType,
        updatePage,
        clearFilters,
    };
};
