import { Tabs } from "expo-router";
import { HouseIcon, Settings2Icon } from "lucide-react-native";

export default function ResortStaffTabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: "Dashboard",
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <HouseIcon size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    title: "Settings",
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <Settings2Icon size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
