


export type LoginDto = {
    email: string;
    password: string;
    userRole: string;
    rememberMe?: boolean;
}

export type SignUpGuest = {
    email: string;
    name: string;
    contactNo: string;
    password: string;
    confirmPassword: string;
}

export type ForgotPasswordDto = {
    email: string;
}

export type ResetPasswordDto = {
    token: string;
    newPassword: string;
    confirmPassword: string;
}