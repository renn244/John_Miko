import { reportTypeLabels } from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import DetailPageHeader from "@/components/ui/detail-page-header";
import ScreenState from "@/components/ui/screen-state";
import { useStaffBookingById } from "@/hooks/staffBookings.hook";
import { useMyStaffReports } from "@/hooks/staffReports.hook";
import { getBookingStayDates, isBookingStayActive } from "@/lib/bookingStay";
import type { ReportStatus, ReportType } from "@/types/staffReport.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AccommodationDetailsCard } from "./AccommodationDetailsCard";
import { GuestDetailsCard } from "./GuestDetailsCard";
import { LinkedReportActionsCard } from "./LinkedReportActionsCard";
import { LinkedReportsCard } from "./LinkedReportsCard";
import { ReservationTimelineCard } from "./ReservationTimelineCard";
import { ServicesOrdersCard } from "./ServicesOrdersCard";
import { SpecialRequestsCard } from "./SpecialRequestsCard";

const reportStatusTone: Record<ReportStatus, "pending" | "approved" | "rejected"> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

type ResortBookingsFallbackHref = "/resort-staff/(bookings)/index";

type BookingDetailScreenProps = {
  fallbackHref: ResortBookingsFallbackHref;
};

const navigateBackToBookings = (
  router: ReturnType<typeof useRouter>,
  fallbackHref: ResortBookingsFallbackHref,
) => {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackHref);
};

export default function BookingDetailScreen({
  fallbackHref,
}: BookingDetailScreenProps) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = typeof params.bookingId === "string" ? params.bookingId : undefined;
  const bookingQuery = useStaffBookingById(bookingId);
  const reportsQuery = useMyStaffReports({ bookingId });
  const reports = reportsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const createLinkedReport = (type: ReportType) => {
    if (!bookingId) return;
    router.push({
      pathname: "/resort-staff/(bookings)/booking-report",
      params: { bookingId, type },
    });
  };

  if (bookingQuery.isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <DetailPageHeader
          onBack={() => navigateBackToBookings(router, fallbackHref)}
          title="Booking details"
        />
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <LoadingIndicator size="large" />
          <Text className="text-base text-neutral-grey-1">
            Loading booking details...
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (!bookingId || bookingQuery.error || !bookingQuery.data) {
    return (
      <BookingNotAvailableState
        bookingId={bookingId}
        refetch={bookingQuery.refetch}
        fallbackHref={fallbackHref}
      />
    );
  }

  const booking = bookingQuery.data;
  const stayInput = {
    bookingDate: booking.bookingDate,
    startTime: booking.stayOption.startTime,
    endTime: booking.stayOption.endTime,
  };
  const { checkIn, checkOut } = getBookingStayDates(stayInput);
  const reportingOpen = isBookingStayActive(stayInput, new Date(now));

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <DetailPageHeader
        onBack={() => navigateBackToBookings(router, fallbackHref)}
        title="Booking details"
        metadata={`Reference: ${booking.referenceCode}`}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 28,
          gap: 10,
        }}
      >
        <GuestDetailsCard booking={booking} />

        <ReservationTimelineCard checkIn={checkIn} checkOut={checkOut} />

        <AccommodationDetailsCard booking={booking} />

        <ServicesOrdersCard booking={booking} />

        <SpecialRequestsCard specialRequests={booking.specialRequests} />

        <LinkedReportActionsCard
          checkIn={checkIn}
          checkOut={checkOut}
          reportingOpen={reportingOpen}
          onCreateReport={createLinkedReport}
        />

        <LinkedReportsCard
          reports={reports}
          isLoading={reportsQuery.isLoading}
          hasError={Boolean(reportsQuery.error)}
          hasNextPage={Boolean(reportsQuery.hasNextPage)}
          isFetchingNextPage={reportsQuery.isFetchingNextPage}
          onRetry={() => reportsQuery.refetch()}
          onLoadMore={() => reportsQuery.fetchNextPage()}
          onOpenReport={(reportId) =>
            router.push({
              pathname: "/resort-staff/(reports)/[reportId]",
              params: { reportId },
            })
          }
          reportTypeLabels={reportTypeLabels}
          reportStatusTone={reportStatusTone}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
}

type BookingNotAvailableStateProps = {
  bookingId?: string;
  refetch: () => void;
  fallbackHref: ResortBookingsFallbackHref;
};

function BookingNotAvailableState({
  bookingId,
  refetch,
  fallbackHref,
}: BookingNotAvailableStateProps) {
  const router = useRouter();

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
      <DetailPageHeader
        onBack={() => navigateBackToBookings(router, fallbackHref)}
        title="Booking details"
        className="-mx-6"
      />
      <View className="flex-1 items-center justify-center">
        <ScreenState
          icon={<AlertTriangle size={24} color="#AB091E" />}
          tone="danger"
          title="Booking not available"
          description="It may no longer be confirmed or upcoming."
          actionLabel={bookingId ? "Retry" : undefined}
          onAction={bookingId ? () => refetch() : undefined}
        />
        <Button
          variant="ghost"
          onPress={() => navigateBackToBookings(router, fallbackHref)}
          className="mt-2"
        >
          <Text className="font-sans-semibold text-base text-neutral-dark-1">
            Go back
          </Text>
        </Button>
      </View>
    </CustomSafeAreaView>
  );
}
