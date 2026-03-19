import { updateSearchParam } from "@/lib/updateSearchParams";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { useSearchParams } from "react-router";

export const useAccommodationSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search: string = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const updateSearch = (value: string) => 
        updateSearchParam(searchParams, setSearchParams, "search", value || undefined);

    const updateType = (value: Accommodation['type'] | "all") => 
        updateSearchParam(searchParams, setSearchParams, "type", value === "all" ? undefined : value);

    const updateStatus = (value: Accommodation['availability'] | "all") =>
        updateSearchParam(searchParams, setSearchParams, "status", value === "all" ? undefined : value);

    return {
        search,
        type: type as Accommodation['type'],
        status: status as Accommodation['availability'],
        updateSearch,
        updateType,
        updateStatus,
    };
};