export type StaffRole = "KITCHEN_STAFF" | "RESORT_STAFF";

export type LoginRequest = {
    email: string;
    password: string;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type ResetPasswordRequest = {
    token: string;
    newPassword: string;
    confirmPassword: string;
};

export type AuthUser = {
    id: string;
    name: string | null;
    email: string;
    role: StaffRole;
};

export type LoginResponse = {
    accessToken: string;
};

export type ForgotPasswordResponse = {
    message: string;
};

export type ResetPasswordResponse = {
    message: string;
};

export type ProfileResponse = AuthUser;
