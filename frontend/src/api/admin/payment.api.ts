import apiClient from "@/lib/apiClient";
import type { PaymentReportBreakdown, RevenueAnalyticsApiItem } from "@/types/admin/payment.type";
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
    getPaymentReports: async (date?: string) => {
        const response = await apiClient.get('/payment/report', {
            params: {
                date
            }
        })

        if(response.status >= 401) {
            throw new Error(response.data.message || 'An error occured while fetching the payment report')
        }

        return response.data as PaymentReportBreakdown;
    },
    getRevenueAnalytics: async () => {
        const response = await apiClient.get('/payment/revenue-analytics')

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching the revenue analytics')
        }

        return response.data as RevenueAnalyticsApiItem[];
    },
}
