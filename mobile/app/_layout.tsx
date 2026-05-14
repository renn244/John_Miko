import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <StatusBar style="dark" />
        <Slot />
        <Toast />
      </KeyboardProvider>
    </QueryClientProvider>
  )
}
