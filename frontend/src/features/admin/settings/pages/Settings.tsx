import SettingsContent from "@/features/shared/settings/components/SettingsContent";
import { useAuthContext } from "@/features/auth/context/AuthContext";

const AdminSettings = () => {
    const { user } = useAuthContext();

    if (!user) return null;

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage your admin account details and password.
                </p>
            </div>

            <div className="max-w-6xl py-2">
                <SettingsContent user={user} />
            </div>
        </div>
    );
};

export default AdminSettings;
