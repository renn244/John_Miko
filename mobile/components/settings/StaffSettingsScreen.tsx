import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import ProfileDetailsForm from "@/components/settings/ProfileDetailsForm";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useProfileQuery } from "@/hooks/profile.hook";
import { deleteAccessToken } from "@/lib/tokenStorage";
import type { ProfileResponse } from "@/types/auth.type";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LogOut, ShieldCheck } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const roleLabels: Record<ProfileResponse["role"], string> = {
    KITCHEN_STAFF: "Kitchen Staff",
    RESORT_STAFF: "Resort Staff",
};

const StaffSettingsScreen = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user, isLoading, refetch } = useProfileQuery();

    const handleLogout = async () => {
        await deleteAccessToken();
        await queryClient.clear();
        router.replace("/login");
    };

    if (isLoading) {
        return (
            <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 items-center justify-center">
                <ActivityIndicator size="large" />
            </CustomSafeAreaView>
        );
    }

    if (!user) {
        return (
            <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
                <View className="flex-1 items-center justify-center px-6 gap-4">
                    <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
                        Unable to load account
                    </Text>
                    <Text className="text-center text-base text-neutral-grey-1">
                        Pull your account details again or return to login if the session expired.
                    </Text>
                    <View className="w-full gap-3">
                        <Button onPress={() => refetch()}>
                            <Text className="text-white font-sans-semibold text-lg">Retry</Text>
                        </Button>
                        <Button variant="outline" onPress={handleLogout}>
                            <Text className="font-sans-semibold text-lg text-neutral-dark-1">Back to Login</Text>
                        </Button>
                    </View>
                </View>
            </CustomSafeAreaView>
        );
    }

    return (
        <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
            <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            >
                <View className="gap-5">
                    <View>
                        <Text className="font-sans-bold text-3xl text-neutral-dark-1">
                            Settings
                        </Text>
                        <Text className="mt-1 text-base text-neutral-grey-1">
                            Update your staff profile details and password.
                        </Text>
                    </View>

                    <View className="rounded-3xl bg-white px-5 py-5 shadow-sm gap-4">
                        <View className="flex-row items-center gap-3">
                            <View className="h-12 w-12 rounded-full bg-primary/15 items-center justify-center">
                                <ShieldCheck color="#1E73BE" size={22} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                                    Account Overview
                                </Text>
                                <Text className="text-base text-neutral-grey-1">
                                    {roleLabels[user.role]} • {user.status}
                                </Text>
                            </View>
                        </View>

                        <View className="rounded-2xl bg-neutral-soft-grey-3 px-4 py-4 gap-2">
                            <Text className="text-sm text-neutral-grey-1">Current Email</Text>
                            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                                {user.email}
                            </Text>
                        </View>
                    </View>

                    <ProfileDetailsForm user={user} />

                    <ChangePasswordForm />

                    <Button
                    variant="outline"
                    onPress={handleLogout}
                    className="bg-system-red"
                    >
                        <LogOut color="#FFFFFF" size={18} />
                        <Text className="font-sans-semibold text-lg text-white">
                            Log Out
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </CustomSafeAreaView>
    );
};

export default StaffSettingsScreen;
