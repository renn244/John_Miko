import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { CreatePaymentMethodDto, GetPaymentMethodsQuery, PaymentMethod, UpdatePaymentMethodDto } from "@/features/shared/payment-methods/types/payment-method.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const adminPaymentMethodsApi = {
    getPaymentMethods: async (query?: GetPaymentMethodsQuery) => {
        const response = await apiClient.get('/payment-methods', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch payment methods');
        }

        return response.data as PaginatedResponse<PaymentMethod>;
    },
    getPaymentMethodById: async (id: string) => {
        const response = await apiClient.get(`/payment-methods/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to fetch payment method');
        }

        return response.data as PaymentMethod;
    },
    createPaymentMethod: async (data: CreatePaymentMethodDto) => {
        const response = await apiClient.post('/payment-methods', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to create payment method');
        }

        return response.data as PaymentMethod;
    },
    updatePaymentMethod: async (id: string, data: UpdatePaymentMethodDto) => {
        const response = await apiClient.patch(`/payment-methods/${id}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to update payment method');
        }

        return response.data as PaymentMethod;
    },
    updatePaymentMethodAvailability: async (id: string, isActive: boolean) => {
        const response = await apiClient.patch(`/payment-methods/availability/${id}`, { isActive });

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'Failed to update payment method');
        }

        return response.data as PaymentMethod;
    }
}
