


export type LoginDto = {
    email: string;
    password: string;
    userRole: string;
    rememberMe?: boolean;
}

export type ForgotPasswordDto = {
    email: string;
}

export type ResetPasswordDto = {
    token: string;
    newPassword: string;
    confirmPassword: string;
}