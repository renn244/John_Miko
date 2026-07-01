import { Tabs } from 'expo-router';
import { MenuIcon, Settings2Icon } from 'lucide-react-native';

export default function KitchenStaffTabLayout() {
    return (
        <Tabs screenOptions={{ tabBarShowLabel: false }}>
            <Tabs.Screen
            name="(queue)"
            options={{
                headerShown: false,
                title: "Dashboard",
                tabBarIcon: ({ color, size }) => (
                    <MenuIcon size={size} color={color} />
                )
            }}
            />

            <Tabs.Screen
            name="settings/index"
            options={{
                headerShown: false,
                title: "Settings",
                tabBarIcon: ({ color, size }) => (
                    <Settings2Icon size={size} color={color} />
                )
            }}
            />
        </Tabs>
    )
}
