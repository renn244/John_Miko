import Logo from "@/assets/app/logo/logo.svg";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { hasSeenIntro, setSeenIntro } from "@/lib/introStorage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
  
export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkIntro = async () => {
      try {
        const seen = await hasSeenIntro();

        if (!isActive) return;

        if (seen) {
          router.replace("/login");
          return;
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    checkIntro();

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleStartOnboarding = () => {
    router.push("/onboarding");
  };

  const handleDirectLogin = async () => {
    try {
      await setSeenIntro();
    } finally {
      router.replace("/login");
    }
  };

  if (isChecking) {
    return <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3" />;
  }

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="absolute -top-16 -right-14 h-48 w-48 rounded-full bg-secondary-blue-light opacity-70" />
      <View className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-secondary-soft-orange opacity-70" />

      <View className="flex-1 justify-between px-6 pt-8 pb-10">
        <View className="items-center gap-3">
          <View className="flex-row items-center gap-3">
            <Logo height={48} width={48} />
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              John Miko's
            </Text>
          </View>
          <Text className="text-center text-neutral-grey-1 text-base">
            Internal resort management for staff operations.
          </Text>
        </View>

        <View className="rounded-3xl bg-white px-5 py-6 shadow-lg gap-2">
          <Text className="font-bold text-xl text-neutral-dark-1">
            Your staff command center
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <View className="h-2.5 w-2.5 rounded-full bg-primary" />
              <Text className="text-lg text-neutral-dark-2">
                Front desk updates and guest support.
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="h-2.5 w-2.5 rounded-full bg-primary" />
              <Text className="text-lg text-neutral-dark-2">
                Kitchen and service coordination.
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="h-2.5 w-2.5 rounded-full bg-primary" />
              <Text className="text-lg text-neutral-dark-2">
                Maintenance tasks and facility status.
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-4">
          <Button
          onPress={handleStartOnboarding}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          className="w-full"
          >
            <Text className="font-sans-semibold text-white text-lg">
              LET'S GO
            </Text>
          </Button>

          <Pressable
          onPress={handleDirectLogin}
          className="items-center"
          >
            <Text className="text-primary font-sans-semibold text-base">
              Staff Login
            </Text>
          </Pressable>
        </View>
      </View>
    </CustomSafeAreaView>
  );
}
