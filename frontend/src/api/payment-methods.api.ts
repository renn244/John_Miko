import apiClient from "@/lib/apiClient";
import type { PaymentMethod } from "@/types/payment-method.type";

export const paymentMethodsApi = {
    getActivePaymentMethods: async () => {
        const response = await apiClient.get('/payment-methods/active');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch payment methods');
        }

        return response.data as PaymentMethod[];
    }
}
