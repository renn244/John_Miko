import { updateSearchParams } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const usePaymentMethodSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') || 1);
    const limit = 10;

    const updatePage = (newPage: number) => 
        updateSearchParams(setSearchParams, { page: newPage === 1 ? undefined : newPage.toString() })

    return{
        page,
        limit,
        updatePage
    }
}