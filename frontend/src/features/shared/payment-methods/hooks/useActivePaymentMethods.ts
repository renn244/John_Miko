import { paymentMethodsApi } from "@/features/shared/payment-methods/api/payment-methods.api";
import { useQuery } from "@tanstack/react-query";

export const useGetActivePaymentMethodsQuery = () => {
    return useQuery({
        queryKey: ['payment-methods', 'active'],
        queryFn: paymentMethodsApi.getActivePaymentMethods,
        refetchOnWindowFocus: false,
    })
}
