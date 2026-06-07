import NavBar from "@/components/common/NavBar";
import SettingsContent from "@/components/pageComponents/Settings/SettingsContent";
import { useAuthContext } from "@/context/AuthContext";

const Settings = () => {
    const { user } = useAuthContext();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold">Settings</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your account details and update your password.
                    </p>
                </div>

                <SettingsContent user={user} />
            </div>
        </div>
    );
};

export default Settings;
