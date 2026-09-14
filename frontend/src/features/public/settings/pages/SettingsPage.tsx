import NavBar from "@/features/public/layout/components/NavBar";
import { GuestContainer, GuestPageShell } from "@/features/public/layout/components/guest";
import SettingsContent from "@/features/shared/settings/components/SettingsContent";
import { useAuthContext } from "@/features/auth/context/AuthContext";

const Settings = () => {
    const { user } = useAuthContext();

    if (!user) return null;

    return (
        <GuestPageShell>
            <NavBar />

            <GuestContainer className="py-8 md:py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-normal md:text-4xl">Settings</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                        Manage your account details and update your password.
                    </p>
                </div>

                <SettingsContent user={user} />
            </GuestContainer>

        </GuestPageShell>
    );
};

export default Settings;
