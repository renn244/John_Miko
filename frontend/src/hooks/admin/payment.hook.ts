import { paymentApi } from "@/api/admin/payment.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useGetPaymentOverviewQuery = (date?: string) => {
    return useQuery({
        queryKey: ['payment', 'overview', date],
        queryFn: () => paymentApi.getPaymentOverview(date),
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

export const useRefundPaymentMutation = (paymentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment', 'refund', paymentId],
        mutationFn: (data: { refundReason: string; refundProofImageUrl: string }) =>
            paymentApi.refundPayment(paymentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment'] });
            queryClient.invalidateQueries({ queryKey: ['booking', 'admin'] });
        }
    })
}
