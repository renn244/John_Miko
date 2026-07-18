import StaffReportForm from "@/components/pageComponents/Resort Staff/StaffReportForm";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import ScreenState from "@/components/ui/screen-state";
import type { ReportType } from "@/types/staffReport.type";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, ArrowLeft } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const reportTypes: ReportType[] = ["checkIn", "checkOut", "maintenance"];

export default function BookingLinkedReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string; type?: string }>();
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  const bookingId =
    typeof params.bookingId === "string" && params.bookingId.trim()
      ? params.bookingId.trim()
      : undefined;
  const initialType = reportTypes.includes(params.type as ReportType)
    ? (params.type as ReportType)
    : undefined;

  useFocusEffect(
    useCallback(() => {
      setFormInstanceKey((current) => current + 1);
    }, []),
  );

  if (!bookingId || !initialType) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 justify-center px-6">
          <ScreenState
            icon={<AlertTriangle size={24} color="#AB091E" />}
            tone="danger"
            title="Report link is invalid"
            description="Open a booking and choose a report type to continue."
            actionLabel="Go back"
            onAction={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.replace("/resort-staff/(bookings)");
            }}
          />
        </View>
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 32,
          gap: 16,
        }}
      >
        <View className="flex-row items-start gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={6}
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center"
          >
            <ArrowLeft size={21} color="#0E33F3" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              New report
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              Document the concern clearly for admin review.
            </Text>
          </View>
        </View>

        <StaffReportForm
          key={`booking-${bookingId}-${initialType}-${formInstanceKey}`}
          bookingId={bookingId}
          initialType={initialType}
          onCreated={(reportId) =>
            router.replace({
              pathname: "/resort-staff/(reports)/[reportId]",
              params: { reportId },
            })
          }
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
}
