import { handleNestError, ValidationError } from "@/lib/handleNestError"
import type { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignUpGuest } from "@/types/auth.types"
import { useMutation } from "@tanstack/react-query"
import type { FieldValues, UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { authApi } from "../api/auth/auth.api"

export const useLoginMutation = <T extends FieldValues>(setError: UseFormSetError<T>) => {
    return useMutation({
        mutationFn: (data: LoginDto) => authApi.login(data),
        onSuccess: (data, variable) => {
            toast.success("Login successful");
            localStorage.setItem("access_token", data.accessToken);

            if(variable.userRole === 'admin') {
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
            localStorage.setItem("access_token", data.accessToken);

            window.location.assign('/guest')
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