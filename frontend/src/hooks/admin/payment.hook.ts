import { paymentApi } from "@/api/admin/payment.api"
import { useQuery } from "@tanstack/react-query"


export const useGetPaymentReports = () => {
    return useQuery({
        queryKey: ['payment', 'report'],
        queryFn: paymentApi.getPaymentReports,
        refetchOnWindowFocus: false
    })
}