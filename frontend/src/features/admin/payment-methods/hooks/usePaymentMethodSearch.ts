import { updateSearchParams } from "@/lib/updateSearchParams";
import type { PaymentMethod } from "@/features/shared/payment-methods/types/payment-method.type";
import { useSearchParams } from "react-router";

export const usePaymentMethodSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive =
        isActiveParam === null
            ? undefined
            : (isActiveParam === "true") as PaymentMethod["isActive"];
    const page = Number(searchParams.get('page') || 1);
    const limit = 10;

    const updateSearch = (newSearch: string) =>
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updateIsActive = (nextIsActive: "all" | "true" | "false") =>
        updateSearchParams(setSearchParams, {
            isActive: nextIsActive === "all" ? undefined : nextIsActive,
            page: undefined,
        });

    const updatePage = (newPage: number) => 
        updateSearchParams(setSearchParams, { page: newPage === 1 ? undefined : newPage.toString() })

    const clearFilters = () => setSearchParams({});

    return{
        search,
        isActive,
        page,
        limit,
        updateSearch,
        updateIsActive,
        updatePage,
        clearFilters,
    }
}
