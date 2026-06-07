import { Stack } from "expo-router";

export default function KitchenOrderLayout() {
    return (
        <Stack>
            <Stack.Screen
            name="[orderId]"
            options={{
                headerShown: false,
            }}
            />
        </Stack>
    );
}
