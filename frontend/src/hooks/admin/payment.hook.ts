import { paymentApi } from "@/api/admin/payment.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


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

export const useGetPaymentsQuery = () => {
    return useQuery({
        queryKey: ['payment', 'list'],
        queryFn: paymentApi.getPayments,
        refetchOnWindowFocus: false,
    })
}

export const useApprovePaymentMutation = (paymentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment', 'approve', paymentId],
        mutationFn: () => paymentApi.approvePayment(paymentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin', 'byId'] });
        }
    })
}

export const useRejectPaymentMutation = (paymentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment', 'reject', paymentId],
        mutationFn: (rejectionNote: string) => paymentApi.rejectPayment(paymentId, rejectionNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin', 'byId'] });
        }
    })
}