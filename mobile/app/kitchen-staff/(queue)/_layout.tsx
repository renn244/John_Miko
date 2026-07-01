import { Stack } from "expo-router";

export default function KitchenQueueStackLayout() {
    return (
        <Stack>
            <Stack.Screen
            name="index"
            options={{
                headerShown: false,
            }}
            />
            <Stack.Screen
            name="order/[orderId]"
            options={{
                headerShown: false,
            }}
            />
        </Stack>
    );
}
