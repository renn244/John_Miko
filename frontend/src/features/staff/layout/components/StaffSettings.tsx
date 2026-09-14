import UserAvatar from "@/components/common/UserAvatar";
import ProfileAvatarControl from "@/features/shared/settings/components/ProfileAvatarControl";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import ChangePasswordForm from "@/features/shared/settings/forms/ChangePasswordForm";
import ProfileSettingsForm from "@/features/shared/settings/forms/ProfileSettingsForm";
import { LogOut, Mail, Phone } from "lucide-react";

type StaffSettingsProps = {
  roleLabel: string;
};

const StaffSettings = ({ roleLabel }: StaffSettingsProps) => {
  const { user, handleLogout } = useAuthContext();

  if (!user) return null;

  return (
    <div className="w-full max-w-3xl space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-base text-muted-foreground">
          Update your staff profile details and password.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <UserAvatar
            avatarUrl={user.profileImageUrl ?? ""}
            name={user.name || user.email}
            className="size-16 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-bold text-foreground">
                {user.name || "Staff Member"}
              </h2>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {roleLabel}
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 truncate">
                <Mail className="size-4 shrink-0" />
                {user.email}
              </p>
              <p className="flex items-center gap-2 truncate">
                <Phone className="size-4 shrink-0" />
                {user.contactNo}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
            {user.status}
          </span>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-foreground">Profile photo</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Add or update the photo shown with your account.
          </p>
        </div>
        <ProfileAvatarControl user={user} />
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-foreground">Profile details</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Manage your personal information.
          </p>
        </div>
        <ProfileSettingsForm user={user} />
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-foreground">Security</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Change your password to keep your account secure.
          </p>
        </div>
        <ChangePasswordForm />
      </section>

      <Button
        type="button"
        variant="outline"
        className="w-full border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
        Log out
      </Button>
    </div>
  );
};

export default StaffSettings;
