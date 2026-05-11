import apiClient from "@/lib/apiClient";
import type { RevenueAnalyticsApiItem } from "@/types/admin/payment.type";

export const paymentApi = {
    getPaymentReports: async () => {
        const response = await apiClient.get('/payment/report')

        if(response.status >= 401) {
            throw new Error(response.data.message || 'An error occured while fetching the payment report')
        }

        return response.data as any;
    },
    getRevenueAnalytics: async () => {
        const response = await apiClient.get('/payment/revenue-analytics')

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching the revenue analytics')
        }

        return response.data as RevenueAnalyticsApiItem[];
    },
}