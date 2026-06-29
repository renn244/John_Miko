import { GuestCard, GuestDivider, GuestInfoChip } from "@/components/guest";
import ChangePasswordForm from "@/forms/Settings/ChangePasswordForm";
import ProfileSettingsForm from "@/forms/Settings/ProfileSettingsForm";
import type { UserProfileDto } from "@/types/auth.types";
import { BadgeCheck, Fingerprint } from "lucide-react";

type SettingsContentProps = {
    user: UserProfileDto;
};

const roleLabels: Record<UserProfileDto["role"], string> = {
    ADMIN: "Administrator",
    GUEST: "Guest",
    KITCHEN_STAFF: "Kitchen Staff",
    RESORT_STAFF: "Resort Staff",
    MAINTENANCE_STAFF: "Maintenance Staff",
};

const SettingsContent = ({ user }: SettingsContentProps) => {
    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="space-y-5">
                <GuestCard accent>
                    <div className="mb-5">
                        <h2 className="text-xl font-bold tracking-normal">
                            Profile and Contact Details
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Update the information used for account access and booking updates.
                        </p>
                    </div>
                    <ProfileSettingsForm user={user} />
                </GuestCard>

                <GuestCard accent>
                    <div className="mb-5">
                        <h2 className="text-xl font-bold tracking-normal">Security</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Change your password to keep your account secure.
                        </p>
                    </div>
                    <ChangePasswordForm />
                </GuestCard>
            </div>

            <aside className="lg:sticky lg:top-24">
                <GuestCard>
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="size-5 text-primary" />
                        <h2 className="text-lg font-bold tracking-normal">
                            Account Overview
                        </h2>
                    </div>

                    <GuestDivider className="my-4" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Role</span>
                            <GuestInfoChip active={user.role === "GUEST"}>
                                {roleLabels[user.role]}
                            </GuestInfoChip>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <GuestInfoChip active={user.status === "ACTIVE"}>
                                {user.status === "ACTIVE" ? "Active" : "Inactive"}
                            </GuestInfoChip>
                        </div>

                        <GuestDivider />

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Fingerprint className="size-4" />
                                Account ID
                            </div>
                            <p className="break-all rounded-lg border bg-muted/40 p-3 text-xs font-medium leading-5 text-muted-foreground">
                                {user.id}
                            </p>
                        </div>
                    </div>
                </GuestCard>
            </aside>
        </div>
    );
};

export default SettingsContent;
