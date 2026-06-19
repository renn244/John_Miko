import ReportBadge from "@/components/pageComponents/Resort Staff/ReportBadge";
import {
  reportSeverityClasses,
  reportStatusClasses,
  reportTypeLabels,
} from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useStaffReportById } from "@/hooks/staffReports.hook";
import { format, parseISO } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "MMM dd, yyyy h:mm a");
};

export default function StaffReportDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reportId?: string }>();
  const reportId =
    typeof params.reportId === "string" ? params.reportId : undefined;
  const query = useStaffReportById(reportId);

  if (query.isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 items-center justify-center bg-neutral-soft-grey-3">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-base text-neutral-grey-1">
          Loading report...
        </Text>
      </CustomSafeAreaView>
    );
  }

  if (!reportId || query.error || !query.data) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans-semibold text-xl text-neutral-dark-1">
            Report not available
          </Text>
          <Text className="mt-2 text-center text-base text-neutral-grey-1">
            It may not exist or you may not have access to it.
          </Text>
          <View className="mt-5 w-full gap-3">
            {reportId ? (
              <Button variant="outline" onPress={() => query.refetch()}>
                <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                  Retry
                </Text>
              </Button>
            ) : null}
            <Button variant="ghost" onPress={() => router.back()}>
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                Go back
              </Text>
            </Button>
          </View>
        </View>
      </CustomSafeAreaView>
    );
  }

  const report = query.data;

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        <View className="flex-row items-start gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
          >
            <ArrowLeft size={21} color="#1F2933" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              Report details
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              Reference: {report.id}
            </Text>
          </View>
        </View>

        <View className="mt-5 gap-4">
          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <View className="flex-row flex-wrap gap-2">
              <ReportBadge
                label={report.status}
                className={reportStatusClasses[report.status]}
              />
              <ReportBadge
                label={reportTypeLabels[report.type]}
                className="bg-neutral-soft-grey-2 text-neutral-dark-2"
              />
              <ReportBadge
                label={`${report.severity} severity`}
                className={reportSeverityClasses[report.severity]}
              />
            </View>

            <Text className="mt-4 font-sans-bold text-2xl text-neutral-dark-1">
              {report.title}
            </Text>
            <Text className="mt-3 text-lg leading-6 text-neutral-dark-2">
              {report.description}
            </Text>

            <View className="mt-4 flex-row items-center gap-2">
              <CalendarDays size={18} color="#6B7580" />
              <Text className="text-base text-neutral-grey-1">
                Submitted {formatDate(report.createdAt)}
              </Text>
            </View>
          </View>

          {report.status === "Rejected" ? (
            <View className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4">
              <Text className="font-sans-semibold text-lg text-red-700">
                Rejection note
              </Text>
              <Text className="mt-2 text-base leading-5 text-red-700">
                {report.rejectionNote?.trim() || "No rejection note was provided."}
              </Text>
            </View>
          ) : null}

          {report.booking ? (
            <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                Linked booking
              </Text>
              <Text className="mt-3 text-lg text-neutral-dark-1">
                {report.booking.guestName}
              </Text>
              <View className="mt-2 flex-row items-center gap-2">
                <MapPin size={18} color="#6B7580" />
                <Text className="text-base text-neutral-grey-1">
                  {report.booking.accommodation.name} ·{" "}
                  {report.booking.accommodation.type}
                </Text>
              </View>
              <Text className="mt-2 text-base text-neutral-grey-1">
                Booking date: {formatDate(report.booking.bookingDate)}
              </Text>
            </View>
          ) : (
            <View className="rounded-3xl bg-white px-5 py-4 shadow-sm">
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                General resort report
              </Text>
              <Text className="mt-2 text-base text-neutral-grey-1">
                This report is not connected to a guest booking.
              </Text>
            </View>
          )}

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Proof photos
            </Text>
            <View className="mt-3 gap-3">
              {report.proofImages.map((imageUrl, index) => (
                <View
                  key={`${imageUrl}-${index}`}
                  className="w-full overflow-hidden rounded-2xl bg-neutral-soft-grey-2"
                  style={{ height: 224 }}
                >
                  <Image
                    source={imageUrl}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={150}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
