import BrandWordmark from "@/components/branding/BrandWordmark";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import type { SessionStatus } from "@/context/SessionContext";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SessionGateScreenProps = {
  status: Extract<SessionStatus, "loading" | "unavailable">;
  error?: string | null;
  onRetry?: () => void;
};

const useDotStyle = (progress: SharedValue<number>, offset: number) => {
  return useAnimatedStyle(() => {
    const value = (progress.value + offset) % 1;

    return {
      opacity: interpolate(value, [0, 0.5, 1], [0.3, 1, 0.3]),
      transform: [{ translateY: interpolate(value, [0, 0.5, 1], [2, -2, 2]) }],
    };
  });
};

export default function SessionGateScreen({ status, error, onRetry }: SessionGateScreenProps) {
  const dotProgress = useSharedValue(0);
  const dotStyleOne = useDotStyle(dotProgress, 0);
  const dotStyleTwo = useDotStyle(dotProgress, 0.18);
  const dotStyleThree = useDotStyle(dotProgress, 0.36);
  const dotStyleFour = useDotStyle(dotProgress, 0.54);

  const isUnavailable = status === "unavailable";

  useEffect(() => {
    dotProgress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    );
  }, [dotProgress]);

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm items-center gap-4">
          <BrandWordmark size="md" />

          <View className="items-center gap-1">
            <Text className="text-center font-sans-bold text-xl text-neutral-dark-1">
              {isUnavailable ? "Workspace unavailable" : "Preparing your workspace"}
            </Text>
            <Text className="max-w-60 text-center text-sm leading-5 text-neutral-grey-1">
              {isUnavailable
                ? error || "Check your connection, then try again."
                : "We're opening the right dashboard for your staff role."}
            </Text>
          </View>

          {isUnavailable ? (
            <Button onPress={onRetry} className="mt-4 w-full">
              <Text className="font-sans-semibold text-white text-base">Retry</Text>
            </Button>
          ) : (
            <View className="mt-4 flex-row items-center gap-5">
              <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleOne} />
              <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleTwo} />
              <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleThree} />
              <Animated.View className="h-2.5 w-2.5 rounded-full bg-primary" style={dotStyleFour} />
            </View>
          )}

          {!isUnavailable && (
            <Text className="text-center font-sans-semibold text-xs uppercase tracking-[3px] text-neutral-dark-2">
              Checking your session
            </Text>
          )}
        </View>
      </View>
    </CustomSafeAreaView>
  );
}
