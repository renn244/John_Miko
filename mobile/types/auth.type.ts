export type StaffRole = "KITCHEN_STAFF" | "RESORT_STAFF" | "MAINTENANCE_STAFF";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type LoginRequest = {
    email: string;
    password: string;
    userRole: StaffRole;
    rememberMe?: boolean;
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
    contactNo: string;
    role: StaffRole;
    status: UserStatus;
    profileImageUrl: string | null;
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

export type UpdateProfileRequest = {
    name: string;
    email: string;
    contactNo: string;
};

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
