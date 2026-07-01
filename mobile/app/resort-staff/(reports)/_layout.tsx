import { Stack } from "expo-router";

export default function ResortStaffReportsStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="[reportId]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
