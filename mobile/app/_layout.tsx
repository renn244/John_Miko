import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { RoleTourProvider } from "@/context/RoleTourContext";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";

import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import '../global.css';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RoleTourProvider>
            <KeyboardProvider>
              <BottomSheetModalProvider>
                <StatusBar style="dark" />
                <RootNavigator />
                <Toast />
              </BottomSheetModalProvider>
            </KeyboardProvider>
          </RoleTourProvider>
        </SessionProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

function RootNavigator() {
  const { status, user } = useSession();
  const isSignedOut = status === "unauthenticated";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reset-password" />

      <Stack.Protected guard={isSignedOut}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={user?.role === "RESORT_STAFF"}>
        <Stack.Screen name="resort-staff" />
      </Stack.Protected>

      <Stack.Protected guard={user?.role === "KITCHEN_STAFF"}>
        <Stack.Screen name="kitchen-staff" />
      </Stack.Protected>

      <Stack.Protected guard={user?.role === "MAINTENANCE_STAFF"}>
        <Stack.Screen name="maintenance-staff" />
      </Stack.Protected>
    </Stack>
  );
}
