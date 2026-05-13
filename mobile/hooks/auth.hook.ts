import apiClient from '@/lib/apiClient';
import { ValidationError } from '@/lib/handleNestError';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
    return useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: async (data: any) => {
            const response = await apiClient.post('/login', data);

            if(response.status === 400) {
                throw new ValidationError(response.data || "Validation Error")
            }

            if(response.status >= 400) {
                throw new Error(response.data.message || "An error occured during the login!")
            }

            return response.data
        },
        onSuccess: (data) => {
            // handle token save here and redirect
        }
    })
}