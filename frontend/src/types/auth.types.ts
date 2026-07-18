
export type LoginDto = {
    email: string;
    password: string;
    userRole: "GUEST" | "ADMIN";
    rememberMe?: boolean;
}

export type LoginResponse = {
    accessToken: string;
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

export type UserRole = "ADMIN" | "GUEST" | "KITCHEN_STAFF" | "RESORT_STAFF" | "MAINTENANCE_STAFF";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type UserProfileDto = {
    id: string;
    name: string | null;
    email: string;
    contactNo: string;
    role: UserRole;
    status: UserStatus;
}

export type UpdateProfileDto = {
    name: string;
    email: string;
    contactNo: string;
}

export type ChangePasswordDto = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type BasicMessageResponse = {
    message: string;
}
