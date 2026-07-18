import { handleNestError, ValidationError } from "@/lib/handleNestError"
import { clearAccessToken, saveAccessToken } from "@/lib/tokenStorage"
import type { ChangePasswordDto, ForgotPasswordDto, LoginDto, ResetPasswordDto, SignUpGuest, UpdateProfileDto } from "@/types/auth.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { FieldValues, UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { authApi } from "../api/auth/auth.api"

export const useLoginMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationFn: async (data: LoginDto) => {
            const loginResponse = await authApi.login(data);
            saveAccessToken(loginResponse.accessToken);

            try {
                return await authApi.getProfile();
            } catch (error) {
                clearAccessToken();
                throw error;
            }
        },
        onSuccess: (user) => {
            toast.success("Login successful");

            if(user.role === 'ADMIN') {
                window.location.assign('/admin')
            } else {
                window.location.assign('/')
            }
        },
        onError: (err) => {
            if(err instanceof ValidationError) {
                handleNestError(err.response, setError)
            } else {
                toast.error(err.message)
            }
        }
    })
}

export const useSignUpGuestMutation = <T extends  FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationFn: (data: SignUpGuest) => authApi.signUpGuest(data),
        onSuccess: (data) => {
            toast.success("Sign up successful.");
            saveAccessToken(data.accessToken);

            window.location.assign('/')
        },
        onError: (err) => {
            if(err instanceof ValidationError) {
                handleNestError(err.response, setError)
            } else {
                toast.error(err.message)
            }
        }
    })
} 

export const useForgotPasswordMutation =  <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationFn: (data: ForgotPasswordDto) => authApi.forgotPassword(data),
        onError: (err) => {
            if(err instanceof ValidationError) {
                handleNestError(err.response, setError)
            } else {
                toast.error(err.message)
            }
        }
    })
}

export const useResendForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordDto) => authApi.resendForgotPassword(data),
        onError: (err) => {
            toast.error(err.message)
        }
    })
}

export const useResetPasswordMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationFn: (data: ResetPasswordDto) => authApi.resetPassword(data),
        onError: (err) => {
            if(err instanceof ValidationError) {
                handleNestError(err.response, setError)
            } else {
                toast.error(err.message)
            }
        }
    })
}

export const useUpdateProfileMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileDto) => authApi.updateProfile(data),
        onSuccess: async () => {
            toast.success("Profile updated successfully.");
            await queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (err) => {
            if(err instanceof ValidationError) {
                handleNestError(err.response, setError)
            } else {
                toast.error(err.message)
            }
        }
    })
}

export const useChangePasswordMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationFn: (data: ChangePasswordDto) => authApi.changePassword(data),
        onSuccess: (data) => {
            toast.success(data.message || "Password updated successfully.");
        },
        onError: (err) => {
            if(err instanceof ValidationError) {
                handleNestError(err.response, setError)
            } else {
                toast.error(err.message)
            }
        }
    })
}
