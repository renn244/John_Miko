import apiClient from "@/lib/apiClient";


export const paymentApi = {
    getPaymentReports: async () => {
        const response = await apiClient.get('/payment/report')

        if(response.status >= 401) {
            throw new Error(response.data.message || 'An error occured while fetching the payment report')
        }

        return response.data as any;
    }
}