import { Tabs } from "expo-router";
import {
    ClipboardList,
    HouseIcon,
    Plus,
    Settings2Icon,
} from "lucide-react-native";
import { View } from "react-native";

export default function ResortStaffTabLayout() {
    return (
        <Tabs screenOptions={{ tabBarShowLabel: false }}>
            <Tabs.Screen
                name="index"
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
                    tabBarIcon: ({ focused }) => (
                        <View
                            className={`h-14 w-14 items-center justify-center rounded-full ${
                                focused ? "bg-primary-dark" : "bg-primary"
                            }`}
                        >
                            <Plus size={28} color="#FFFFFF" />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="reports/index"
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

            <Tabs.Screen
                name="reports/[reportId]"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="booking/[bookingId]"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="booking-report"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
