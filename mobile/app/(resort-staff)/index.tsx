import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useProfileQuery } from "@/hooks/profile.hook";
import { useRouter } from "expo-router";
import { Building2, Settings2 } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

export default function ResortStaffHomeScreen() {
    const router = useRouter();
    const { data: user, isLoading } = useProfileQuery();

    if (isLoading) {
        return (
            <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 items-center justify-center">
                <ActivityIndicator size="large" />
            </CustomSafeAreaView>
        );
    }

    return (
        <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
            <View className="flex-1 px-5 py-6 gap-5">
                <View>
                    <Text className="font-sans-bold text-3xl text-neutral-dark-1">
                        Resort Staff
                    </Text>
                    <Text className="mt-1 text-base text-neutral-grey-1">
                        Basic staff account access is ready while the rest of the resort workflow catches up.
                    </Text>
                </View>

                <View className="rounded-3xl bg-white px-5 py-6 shadow-sm gap-4">
                    <View className="h-14 w-14 rounded-full bg-primary/15 items-center justify-center">
                        <Building2 color="#1E73BE" size={26} />
                    </View>

                    <View className="gap-1">
                        <Text className="font-sans-semibold text-2xl text-neutral-dark-1">
                            Welcome{user?.name ? `, ${user.name}` : ""}
                        </Text>
                        <Text className="text-base text-neutral-grey-1">
                            Use settings to manage your profile details and password.
                        </Text>
                    </View>

                    <Button onPress={() => router.push("/(resort-staff)/settings")}>
                        <Settings2 color="#FFFFFF" size={18} />
                        <Text className="text-white font-sans-semibold text-lg">
                            Open Settings
                        </Text>
                    </Button>
                </View>
            </View>
        </CustomSafeAreaView>
    );
}
