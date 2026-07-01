import { Stack } from "expo-router";

export default function MaintenanceAssignedStackLayout() {
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
