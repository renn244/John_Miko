import { Tabs } from 'expo-router';
import { MenuIcon } from 'lucide-react-native';

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
            name="[orderId]"
            options={{
                title: "Order Details",
                href: null,
            }}
            />
        </Tabs>
    )
}