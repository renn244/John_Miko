import { Tabs } from "expo-router";
import {
    ClipboardList,
    HouseIcon,
    Plus,
    Settings2Icon,
} from "lucide-react-native";

export default function ResortStaffTabLayout() {
    return (
        <Tabs screenOptions={{ tabBarShowLabel: false }}>
            <Tabs.Screen
                name="(bookings)"
                options={{
                    headerShown: false,
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <HouseIcon size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="new-report"
                options={{
                    headerShown: false,
                    title: "New Report",
                    tabBarIcon: ({ color, size }) => (
                        <Plus size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="(reports)"
                options={{
                    headerShown: false,
                    title: "My Reports",
                    tabBarIcon: ({ color, size }) => (
                        <ClipboardList size={size} color={color} />
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
