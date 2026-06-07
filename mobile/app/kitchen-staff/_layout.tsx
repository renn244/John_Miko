import { Tabs } from 'expo-router';
import { MenuIcon, Settings2Icon } from 'lucide-react-native';

export default function KitchenStaffTabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
            
            name="index"
            options={{
                headerShown: false,
                title: "Dashboard",
                tabBarShowLabel: false,
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
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                    <Settings2Icon size={size} color={color} />
                )
            }}
            />
        </Tabs>
    )
}
