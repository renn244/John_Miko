import { paymentApi } from "@/api/admin/payment.api"
import { useQuery } from "@tanstack/react-query"


export const useGetPaymentReports = () => {
    return useQuery({
        queryKey: ['payment', 'report'],
        queryFn: paymentApi.getPaymentReports,
        refetchOnWindowFocus: false
    })
}

export const useGetRevenueAnalyticsQuery = () => {
    return useQuery({
        queryKey: ['payment', 'revenue-analytics'],
        queryFn: paymentApi.getRevenueAnalytics,
        refetchOnWindowFocus: false,
    })
}