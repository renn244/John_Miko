import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import apiClient from "@/lib/apiClient";
import { getAccessToken } from "@/lib/tokenStorage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    type SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

const roleRoutes = {
    RESORT_STAFF: "/resort-staff",
    KITCHEN_STAFF: "/kitchen-staff",
    MAINTENANCE_STAFF: "/maintenance-staff",
} as const;

const useDotStyle = (progress: SharedValue<number>, offset: number) => {
    return useAnimatedStyle(() => {
        const value = (progress.value + offset) % 1;
        return {
            opacity: interpolate(value, [0, 0.5, 1], [0.3, 1, 0.3]),
            transform: [
                { translateY: interpolate(value, [0, 0.5, 1], [2, -2, 2]) },
            ],
        };
    });
};

function Redirecting() {
    const router = useRouter();
    const [status, setStatus] = useState("Checking your session...");

    const dotProgress = useSharedValue(0);

    const dotStyleOne = useDotStyle(dotProgress, 0);
    const dotStyleTwo = useDotStyle(dotProgress, 0.18);
    const dotStyleThree = useDotStyle(dotProgress, 0.36);
    const dotStyleFour = useDotStyle(dotProgress, 0.54);

    useEffect(() => {
        dotProgress.value = withRepeat(
            withTiming(1, { duration: 900, easing: Easing.linear }),
            -1,
            false
        );
    }, [dotProgress]);

    useEffect(() => {
        let isActive = true;
        let redirectTimer: ReturnType<typeof setTimeout> | null = null;

        const routeUser = async () => {
            setStatus("Checking your session...");

            try {
                const token = await getAccessToken();

                if (!token) {
                    if (!isActive) return;
                    setStatus("No session found. Heading to login...");
                    redirectTimer = setTimeout(() => {
                        router.replace("/login");
                    }, 600);
                    return;
                }

                if (!isActive) return;
                setStatus("Loading your profile...");

                const response = await apiClient.get("/auth/profile");

                if (!isActive) return;

                if (response.status >= 400) {
                    setStatus("Session expired. Returning to login...");
                    redirectTimer = setTimeout(() => {
                        router.replace("/login");
                    }, 600);
                    return;
                }

                const role = response.data?.role as keyof typeof roleRoutes | undefined;
                const destination = role ? roleRoutes[role] : "/login";
                setStatus("Opening your dashboard...");
                redirectTimer = setTimeout(() => {
                    router.replace(destination as any);
                }, 600);
            } catch {
                if (!isActive) return;
                setStatus("Something went wrong. Returning to login...");
                redirectTimer = setTimeout(() => {
                    router.replace("/login");
                }, 600);
            }
        };

        routeUser();

        return () => {
            isActive = false;
            if (redirectTimer) {
                clearTimeout(redirectTimer);
            }
        };
    }, [router]);

    return (
        <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-full max-w-sm items-center gap-4">
                    <Text className="font-sans-bold text-xl text-primary">
                        John Miko&apos;s
                    </Text>

                    <View className="items-center gap-1">
                        <Text className="text-center font-sans-bold text-xl text-neutral-dark-1">
                            Preparing your workspace
                        </Text>
                        <Text className="max-w-60 text-center text-sm leading-5 text-neutral-grey-1">
                            We&apos;re opening the right dashboard for your staff role.
                        </Text>
                    </View>

                    <View className="mt-4 flex-row items-center gap-5">
                        <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleOne} />
                        <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleTwo} />
                        <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleThree} />
                        <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleFour} />
                    </View>

                    <Text className="text-center font-sans-semibold text-xs uppercase tracking-[3px] text-neutral-dark-2">
                        {status}
                    </Text>
                </View>
            </View>
        </CustomSafeAreaView>
    );
}

export default Redirecting
