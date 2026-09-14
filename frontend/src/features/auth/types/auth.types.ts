
export type LoginDto = {
    email: string;
    password: string;
    userRole: UserRole;
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

export type StaffRole = Extract<
    UserRole,
    "KITCHEN_STAFF" | "RESORT_STAFF" | "MAINTENANCE_STAFF"
>;

export const STAFF_ROLES: readonly StaffRole[] = [
    "KITCHEN_STAFF",
    "RESORT_STAFF",
    "MAINTENANCE_STAFF",
];

export const isStaffRole = (role: UserRole): role is StaffRole =>
    STAFF_ROLES.includes(role as StaffRole);

export type UserStatus = "ACTIVE" | "INACTIVE";

export type UserProfileDto = {
    id: string;
    name: string | null;
    email: string;
    contactNo: string;
    role: UserRole;
    status: UserStatus;
    profileImageUrl: string | null;
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
