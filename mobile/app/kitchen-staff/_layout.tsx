import { Tabs } from 'expo-router';
import { ClipboardList, History, Settings2Icon } from 'lucide-react-native';

export default function KitchenStaffTabLayout() {
    return (
        <Tabs screenOptions={{ tabBarShowLabel: false }}>
            <Tabs.Screen
            name="(queue)"
            options={{
                headerShown: false,
                title: "Kitchen Queue",
                tabBarIcon: ({ color, size }) => (
                    <ClipboardList size={size} color={color} />
                )
            }}
            />

            <Tabs.Screen
            name="(history)"
            options={{
                headerShown: false,
                title: "History",
                tabBarIcon: ({ color, size }) => (
                    <History size={size} color={color} />
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
