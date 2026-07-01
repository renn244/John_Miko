import { Tabs } from "expo-router";
import { ClipboardCheck, History, Settings2Icon } from "lucide-react-native";

export default function MaintenanceStaffTabLayout() {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen
        name="(assigned)"
        options={{
          headerShown: false,
          title: "Assigned",
          tabBarIcon: ({ color, size }) => (
            <ClipboardCheck size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(history)"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings/index"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings2Icon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
