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
    withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";

const roleRoutes = {
    RESORT_STAFF: "/resort-staff",
    KITCHEN_STAFF: "/kitchen-staff",
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

    const ringProgress = useSharedValue(0);
    const ringProgressDelayed = useSharedValue(0);
    const dotProgress = useSharedValue(0);

    const ringStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(ringProgress.value, [0, 1], [0.35, 0]),
            transform: [
                { scale: interpolate(ringProgress.value, [0, 1], [0.8, 1.5]) },
            ],
        };
    });

    const ringDelayedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(ringProgressDelayed.value, [0, 1], [0.35, 0]),
            transform: [
                { scale: interpolate(ringProgressDelayed.value, [0, 1], [0.8, 1]) },
            ],
        };
    });

    const dotStyleOne = useDotStyle(dotProgress, 0);
    const dotStyleTwo = useDotStyle(dotProgress, 0.2);
    const dotStyleThree = useDotStyle(dotProgress, 0.4);

    useEffect(() => {
        ringProgress.value = withRepeat(
            withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }),
            -1,
            false
        );
        ringProgressDelayed.value = withDelay(
            700,
            withRepeat(
                withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }),
                -1,
                false
            )
        );
        dotProgress.value = withRepeat(
            withTiming(1, { duration: 900, easing: Easing.linear }),
            -1,
            false
        );
    }, [dotProgress, ringProgress, ringProgressDelayed]);

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
                console.log(destination)
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
            <View className="absolute -top-10 -left-12 h-44 w-44 rounded-full bg-secondary-blue-light opacity-60" />
            <View className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-secondary-soft-orange opacity-70" />

            <View className="flex-1 items-center justify-center px-6">
                <View className="w-full max-w-sm rounded-3xl bg-white px-6 py-8 shadow-lg">
                    <View className="items-center gap-5">
                        <View className="relative items-center justify-center">
                            <Animated.View
                            className="absolute h-28 w-28 rounded-full border border-primary"
                            style={ringStyle}
                            />
                            <Animated.View
                            className="absolute h-28 w-28 rounded-full border border-primary"
                            style={ringDelayedStyle}
                            />
                            <View className="h-16 w-16 rounded-full bg-primary items-center justify-center">
                                <Text className="text-white font-sans-bold text-xl">JM</Text>
                            </View>
                        </View>

                        <View className="items-center gap-2">
                            <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                                Routing you in
                            </Text>
                            <Text className="text-center text-neutral-grey-1 text-base">
                                {status}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Animated.View className="h-2 w-2 rounded-full bg-primary" style={dotStyleOne} />
                            <Animated.View className="h-2 w-2 rounded-full bg-primary" style={dotStyleTwo} />
                            <Animated.View className="h-2 w-2 rounded-full bg-primary" style={dotStyleThree} />
                        </View>
                    </View>
                </View>
            </View>
        </CustomSafeAreaView>
    );
}

export default Redirecting
