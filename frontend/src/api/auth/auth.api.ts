import apiClient from "@/lib/apiClient"
import { ValidationError } from "@/lib/handleNestError";
import type { ForgotPasswordDto, LoginDto, ResetPasswordDto } from "@/types/auth.types"

export const authApi = {
    login: async (data: LoginDto) => {
        const response = await apiClient.post('/auth/login', data);

        if(response.status == 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response
    },
    forgotPassword: async (data: ForgotPasswordDto) => {
        const response = await apiClient.post('/auth/forgotPassword', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response
    },
    resendForgotPassword: async (data: ForgotPasswordDto) => {
        const response = await apiClient.post('/auth/resendForgotPassword', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.mesasge || "Unexpected error")
        }

        return response
    },
    resetPassword: async (data: ResetPasswordDto) => {
        const response = await apiClient.post('/auth/resetPassword', data);

        if(response.status == 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response
    },
    check: () => apiClient.get('/auth/profile'),
}
