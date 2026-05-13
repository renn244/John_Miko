import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";

import '../global.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Slot />
    </QueryClientProvider>
  )
}
