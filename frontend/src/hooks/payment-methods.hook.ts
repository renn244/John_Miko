import { paymentMethodsApi } from "@/api/payment-methods.api";
import { useQuery } from "@tanstack/react-query";

export const useGetActivePaymentMethodsQuery = () => {
    return useQuery({
        queryKey: ['payment-methods', 'active'],
        queryFn: paymentMethodsApi.getActivePaymentMethods,
        refetchOnWindowFocus: false,
    })
}
