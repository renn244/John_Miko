import { updateSearchParam } from "@/lib/updateSearchParams";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { useSearchParams } from "react-router";

export const useAccommodationSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page") || "1");
    const limit = 8;

    const updateSearch = (value: string) => {
        updateSearchParam(searchParams, setSearchParams, "search", value || undefined);
        updatePage(1); // Reset to first page on new search
    }

    const updateType = (value: Accommodation['type'] | "all") => {
        updateSearchParam(searchParams, setSearchParams, "type", value === "all" ? undefined : value);
        updatePage(1);
    }

    const updateStatus = (value: Accommodation['availability'] | "all") => {
        updateSearchParam(searchParams, setSearchParams, "status", value === "all" ? undefined : value);
        updatePage(1);
    }

    const updatePage = (value: number) => {
        updateSearchParam(searchParams, setSearchParams, "page", value.toString());
    };

    return {
        search,
        type: type as Accommodation['type'],
        status: status as Accommodation['availability'],
        page,
        limit,
        updateSearch,
        updateType,
        updateStatus,
        updatePage
    };
};