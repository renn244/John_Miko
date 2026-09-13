import apiClient from "@/lib/apiClient";
import type { PaymentOverview, RevenueAnalyticsApiItem } from "@/features/admin/payments/types/payment.type";
import type { PaymentRecord } from "@/types/payment.type";

export const paymentApi = {
    getPayments: async () => {
        const response = await apiClient.get('/payment')

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching payments')
        }

        return response.data as PaymentRecord[];
    },
    getPaymentById: async (id: string) => {
        const response = await apiClient.get(`/payment/${id}`)

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching payment')
        }

        return response.data as PaymentRecord;
    },
    approvePayment: async (id: string) => {
        const response = await apiClient.patch(`/payment/${id}/approve`)

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while approving payment')
        }

        return response.data;
    },
    rejectPayment: async (id: string, rejectionNote: string) => {
        const response = await apiClient.patch(`/payment/${id}/reject`, { rejectionNote })

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while rejecting payment')
        }

        return response.data;
    },
    refundPayment: async (id: string, data: { refundReason: string; refundProofImageUrl: string }) => {
        const response = await apiClient.patch(`/payment/${id}/refund`, data);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while recording the refund');
        }

        return response.data;
    },
    getPaymentOverview: async (date?: string) => {
        const response = await apiClient.get('/payment/overview', {
            params: { date }
        })

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching the payment overview')
        }

        return response.data as PaymentOverview;
    },
    getRevenueAnalytics: async () => {
        const response = await apiClient.get('/payment/revenue-analytics')

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching the revenue analytics')
        }

        return response.data as RevenueAnalyticsApiItem[];
    },
}
