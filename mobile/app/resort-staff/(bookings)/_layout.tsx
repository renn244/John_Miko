import { Stack } from "expo-router";

export default function ResortStaffBookingsStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="booking/[bookingId]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="booking-report"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
