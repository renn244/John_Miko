import apiClient from '@/lib/apiClient';
import { handleNestError, ValidationError } from '@/lib/handleNestError';
import { toast } from '@/lib/toast';
import { saveAccessToken } from '@/lib/tokenStorage';
import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest,
    ResetPasswordResponse
} from '@/types/auth.type';
import { useMutation } from '@tanstack/react-query';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

export const useLoginMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: async (data: LoginRequest) => {
            const response = await apiClient.post('/auth/login', {
                ...data,
                rememberMe: true,
            });

            if (response.status === 400) {
                throw new ValidationError(response.data || "Validation Error");
            }

            if (response.status >= 400) {
                throw new Error(response.data.message || "Something went wrong. Please try again.");
            }

            return response.data as LoginResponse;
        },
        onSuccess: async (data) => {
            await saveAccessToken(data.accessToken);
        },
        onError: (err) => {
            if (err instanceof ValidationError) {
                handleNestError(err.response, setError);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        },
    })
}

export const useForgotPasswordMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: async (data: ForgotPasswordRequest) => {
            const response = await apiClient.post('/auth/forgotPassword', data);

            if (response.status === 400) {
                throw new ValidationError(response.data || "Validation Error");
            }

            if (response.status >= 400) {
                throw new Error(response.data.message || "Something went wrong. Please try again.");
            }

            return response.data as ForgotPasswordResponse;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Email sent!");
        },
        onError: (err) => {
            if (err instanceof ValidationError) {
                handleNestError(err.response, setError);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        },
    })
}

export const useResendForgotPasswordMutation = () => {
    return useMutation({
        mutationKey: ['auth', 'resend-forgot-password'],
        mutationFn: async (data: ForgotPasswordRequest) => {
            const response = await apiClient.post('/auth/resendForgotPassword', data);

            if (response.status === 400) {
                throw new ValidationError(response.data || "Validation Error");
            }

            if (response.status >= 400) {
                throw new Error(response.data.message || "Something went wrong. Please try again.");
            }

            return response.data as ForgotPasswordResponse;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Reset email resent.");
        },
        onError: (err) => {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        },
    })
}

export const useResetPasswordMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationKey: ['auth', 'reset-password'],
        mutationFn: async (data: ResetPasswordRequest) => {
            const response = await apiClient.post('/auth/resetPassword', data);

            if (response.status === 400) {
                throw new ValidationError(response.data || "Validation Error");
            }

            if (response.status >= 400) {
                throw new Error(response.data.message || "Something went wrong. Please try again.");
            }

            return response.data as ResetPasswordResponse;
        },
        onError: (err) => {
            if (err instanceof ValidationError) {
                handleNestError(err.response, setError);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        },
    })
}
