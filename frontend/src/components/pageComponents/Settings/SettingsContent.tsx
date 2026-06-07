import ChangePasswordForm from "@/forms/Settings/ChangePasswordForm";
import ProfileSettingsForm from "@/forms/Settings/ProfileSettingsForm";
import type { UserProfileDto } from "@/types/auth.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Shield } from "lucide-react";

type SettingsContentProps = {
    user: UserProfileDto;
}

const roleLabels: Record<UserProfileDto["role"], string> = {
    ADMIN: "Administrator",
    GUEST: "Guest",
    KITCHEN_STAFF: "Kitchen Staff",
    RESORT_STAFF: "Resort Staff",
};

const SettingsContent = ({ user }: SettingsContentProps) => {
    return (
        <div className="grid gap-6 ">
            <Card className="gap-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-primary" />
                        Account Overview
                    </CardTitle>
                    <CardDescription>
                        Review your current account role and keep your basic account details up to date.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="mt-1 font-semibold">{roleLabels[user.role]}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Account Status</p>
                            <p className="mt-1 font-semibold">{user.status}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Account ID</p>
                            <p className="mt-1 break-all text-sm font-medium">{user.id}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="gap-4">
                <CardHeader>
                    <CardTitle>Profile and Contact Details</CardTitle>
                    <CardDescription>
                        Update the information used across your account and guest-facing records.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileSettingsForm user={user} />
                </CardContent>
            </Card>

            <Card className="gap-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Change your password to keep your account secure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsContent;
