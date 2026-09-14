import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { BasicMessageResponse, ChangePasswordDto, ForgotPasswordDto, LoginDto, LoginResponse, ResetPasswordDto, SignUpGuest, UpdateProfileDto, UserProfileDto } from "@/features/auth/types/auth.types";

export const authApi = {
    login: async (data: LoginDto) => {
        const response = await apiClient.post('/auth/login', {
            email: data.email,
            password: data.password,
            userRole: data.userRole,
            rememberMe: data.rememberMe ?? false,
        });

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data as LoginResponse
    },
    signUpGuest: async (data: SignUpGuest)=> {
        const response = await apiClient.post('/auth/signUpGuest', data)
    
        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data;
    },
    forgotPassword: async (data: ForgotPasswordDto) => {
        const response = await apiClient.post('/auth/forgotPassword', { ...data, platform: 'web' });

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data
    },
    resendForgotPassword: async (data: ForgotPasswordDto) => {
        const response = await apiClient.post('/auth/resendForgotPassword', { ...data, platform: 'web' });

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.mesasge || "Unexpected error")
        }

        return response.data
    },
    resetPassword: async (data: ResetPasswordDto) => {
        const response = await apiClient.post('/auth/resetPassword', data);

        if(response.status == 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error")
        }

        return response.data
    },
    check: () => apiClient.get('/auth/profile'),
    getProfile: async () => {
        const response = await apiClient.get('/auth/profile');

        if (response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error");
        }

        return response.data as UserProfileDto;
    },
    updateProfile: async (data: UpdateProfileDto) => {
        const response = await apiClient.patch('/auth/profile', data);

        if (response.status === 400) {
            throw new ValidationError(response.data);
        }

        if (response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error");
        }

        return response.data as UserProfileDto;
    },
    updateProfileImage: async (profileImageUrl: string | null) => {
        const response = await apiClient.patch('/auth/profile-image', { profileImageUrl });

        if (response.status >= 400) {
            throw new Error(response.data.message || "Unable to update profile picture.");
        }

        return response.data as UserProfileDto;
    },
    changePassword: async (data: ChangePasswordDto) => {
        const response = await apiClient.patch('/auth/change-password', data);

        if (response.status === 400) {
            throw new ValidationError(response.data);
        }

        if (response.status >= 401) {
            throw new Error(response.data.message || "Unexpected error");
        }

        return response.data as BasicMessageResponse;
    },
}
