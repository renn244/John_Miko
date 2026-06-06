import { adminPaymentMethodsApi } from "@/api/admin/payment-methods.api";
import type { GetPaymentMethodsQuery, PaymentMethod } from "@/types/payment-method.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPaymentMethodsQuery = (query: GetPaymentMethodsQuery) => {
    return useQuery({
        queryKey: ['payment-methods', 'admin', query],
        queryFn: () => adminPaymentMethodsApi.getPaymentMethods(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
}

export const useGetPaymentMethodByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['payment-methods', 'admin', 'byId', id],
        queryFn: () => adminPaymentMethodsApi.getPaymentMethodById(id),
        refetchOnWindowFocus: false,
    })
}

export const useCreatePaymentMethodMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment-methods', 'create'],
        mutationFn: adminPaymentMethodsApi.createPaymentMethod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods', 'admin'] });
        }
    })
}

export const useUpdatePaymentMethodMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment-methods', 'update', id],
        mutationFn: (data: any) => adminPaymentMethodsApi.updatePaymentMethod(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['payment-methods', 'admin', 'byId', id] });
        }
    })
}

export const useUpdatePaymentMethodAvailabilityMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment-methods', 'availability', id],
        mutationFn: (isActive: PaymentMethod['isActive']) => adminPaymentMethodsApi.updatePaymentMethodAvailability(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods', 'admin'] });
        }
    })
}

export const useDeletePaymentMethodMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['payment-methods', 'delete', id],
        mutationFn: () => adminPaymentMethodsApi.deletePaymentMethod(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods', 'admin'] });
        }
    })
}
