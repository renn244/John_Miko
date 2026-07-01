import { Stack } from "expo-router";

export default function MaintenanceHistoryStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ticket/[maintenanceId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
