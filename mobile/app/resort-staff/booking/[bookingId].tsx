import ReportBadge from "@/components/pageComponents/Resort Staff/ReportBadge";
import {
  reportStatusClasses,
  reportTypeLabels,
} from "@/components/pageComponents/Resort Staff/reportDisplay";
import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useStaffBookingById } from "@/hooks/staffBookings.hook";
import { useMyStaffReports } from "@/hooks/staffReports.hook";
import {
  getBookingStayDates,
  isBookingStayActive,
} from "@/lib/bookingStay";
import type { ReportType } from "@/types/staffReport.type";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  LogIn,
  LogOut,
  Mail,
  Phone,
  Wrench,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function StaffBookingDetailsScreen() {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId =
    typeof params.bookingId === "string" ? params.bookingId : undefined;
  const bookingQuery = useStaffBookingById(bookingId);
  const reportsQuery = useMyStaffReports({ bookingId });
  const reports =
    reportsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const createLinkedReport = (type: ReportType) => {
    if (!bookingId) return;
    router.push({
      pathname: "/resort-staff/booking-report",
      params: { bookingId, type },
    });
  };

  if (bookingQuery.isLoading) {
    return (
      <CustomSafeAreaView className="flex-1 items-center justify-center bg-neutral-soft-grey-3">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-base text-neutral-grey-1">
          Loading booking...
        </Text>
      </CustomSafeAreaView>
    );
  }

  if (!bookingId || bookingQuery.error || !bookingQuery.data) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans-semibold text-xl text-neutral-dark-1">
            Booking not available
          </Text>
          <Text className="mt-2 text-center text-base text-neutral-grey-1">
            It may no longer be confirmed or upcoming.
          </Text>
          <View className="mt-5 w-full gap-3">
            {bookingId ? (
              <Button variant="outline" onPress={() => bookingQuery.refetch()}>
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
              Booking details
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              Reference: {booking.id}
            </Text>
          </View>
        </View>

        <View className="mt-5 gap-4">
          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              {booking.guestName}
            </Text>
            <View className="mt-3 gap-2">
              <View className="flex-row items-center gap-2">
                <Phone size={18} color="#6B7580" />
                <Text className="text-base text-neutral-grey-1">
                  {booking.contactNo}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Mail size={18} color="#6B7580" />
                <Text className="text-base text-neutral-grey-1">
                  {booking.email}
                </Text>
              </View>
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <View className="flex-row items-center gap-2">
              <CalendarDays size={19} color="#1F2933" />
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                Reservation
              </Text>
            </View>
            <View className="mt-4 gap-4">
              <ReservationTime
                label="Check-in"
                dateTime={format(checkIn, "PPP p")}
                weekday={format(checkIn, "EEEE")}
              />
              <View className="h-px bg-neutral-soft-grey-2" />
              <ReservationTime
                label="Check-out"
                dateTime={format(checkOut, "PPP p")}
                weekday={format(checkOut, "EEEE")}
              />
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Accommodation
            </Text>
            <Text className="mt-3 text-xl text-neutral-dark-1">
              {booking.accommodation.name}
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              {booking.accommodation.type} · {booking.stayOptionLabelSnapshot}
            </Text>

            <View className="mt-4 flex-row flex-wrap gap-3">
              <GuestCount label="Adults" value={booking.adultGuests} />
              <GuestCount label="Children" value={booking.kidGuests} />
              <GuestCount label="Seniors" value={booking.seniorGuest} />
              <GuestCount label="Total" value={booking.numberOfGuests} />
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Special requests
            </Text>
            <Text className="mt-3 text-base leading-5 text-neutral-dark-2">
              {booking.specialRequests?.trim() || "No special requests."}
            </Text>
          </View>

          <ListCard
            title="Add-on services"
            emptyText="No add-on services."
            items={booking.addOns.map(
              (item) => `${item.name} × ${item.quantity}`,
            )}
          />

          <ListCard
            title="Restaurant pre-orders"
            emptyText="No restaurant pre-orders."
            items={booking.preOrders.map(
              (item) => `${item.name} × ${item.quantity} · ${item.status}`,
            )}
          />

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <Text className="font-sans-semibold text-lg text-neutral-dark-1">
              Create linked report
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              The selected report type will be locked to this booking.
            </Text>
            {!reportingOpen ? (
              <View className="mt-3 rounded-2xl bg-amber-50 px-4 py-3">
                <Text className="font-sans-semibold text-base text-amber-700">
                  Reporting is not open yet
                </Text>
                <Text className="mt-1 text-base text-amber-700">
                  Linked reports are available from {format(checkIn, "PPP p")} until{" "}
                  {format(checkOut, "PPP p")}.
                </Text>
              </View>
            ) : null}
            <View className="mt-4 gap-3">
              <Button
                disabled={!reportingOpen}
                onPress={() => createLinkedReport("checkIn")}
              >
                <LogIn size={18} color="#FFFFFF" />
                <Text className="font-sans-semibold text-lg text-white">
                  Check-in Report
                </Text>
              </Button>
              <Button
                variant="secondary"
                disabled={!reportingOpen}
                onPress={() => createLinkedReport("checkOut")}
              >
                <LogOut size={18} color="#1F2933" />
                <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                  Check-out Report
                </Text>
              </Button>
              <Button
                variant="outline"
                disabled={!reportingOpen}
                onPress={() => createLinkedReport("maintenance")}
              >
                <Wrench size={18} color="#1F2933" />
                <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                  Maintenance Report
                </Text>
              </Button>
            </View>
          </View>

          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
            <View className="flex-row items-center gap-2">
              <ClipboardCheck size={19} color="#1F2933" />
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                My linked reports
              </Text>
            </View>

            {reportsQuery.isLoading ? (
              <ActivityIndicator className="mt-4" />
            ) : reportsQuery.error ? (
              <View className="mt-3 gap-3">
                <Text className="text-base text-neutral-grey-1">
                  Could not load reports linked to this booking.
                </Text>
                <Button variant="outline" onPress={() => reportsQuery.refetch()}>
                  <Text className="font-sans-semibold text-base text-neutral-dark-1">
                    Retry reports
                  </Text>
                </Button>
              </View>
            ) : reports.length ? (
              <View className="mt-3 gap-3">
                {reports.map((report) => (
                  <Pressable
                    key={report.id}
                    onPress={() =>
                      router.push({
                        pathname: "/resort-staff/reports/[reportId]",
                        params: { reportId: report.id },
                      })
                    }
                    className="rounded-2xl bg-neutral-soft-grey-3 px-4 py-3"
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <Text className="font-sans-semibold text-base text-neutral-dark-1">
                          {report.title}
                        </Text>
                        <Text className="mt-1 text-sm text-neutral-grey-1">
                          {reportTypeLabels[report.type]}
                        </Text>
                      </View>
                      <ReportBadge
                        label={report.status}
                        className={reportStatusClasses[report.status]}
                      />
                    </View>
                  </Pressable>
                ))}
                {reportsQuery.hasNextPage ? (
                  <Button
                    variant="ghost"
                    disabled={reportsQuery.isFetchingNextPage}
                    onPress={() => reportsQuery.fetchNextPage()}
                  >
                    {reportsQuery.isFetchingNextPage ? (
                      <ActivityIndicator />
                    ) : (
                      <Text className="font-sans-semibold text-base text-primary">
                        Load more reports
                      </Text>
                    )}
                  </Button>
                ) : null}
              </View>
            ) : (
              <Text className="mt-3 text-base text-neutral-grey-1">
                You have not submitted a report for this booking.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function ReservationTime({
  label,
  dateTime,
  weekday,
}: {
  label: string;
  dateTime: string;
  weekday: string;
}) {
  return (
    <View>
      <Text className="text-base text-neutral-grey-1">{label}</Text>
      <Text className="mt-1 font-sans-semibold text-lg text-neutral-dark-1">
        {dateTime}
      </Text>
      <Text className="mt-1 text-base text-neutral-grey-1">{weekday}</Text>
    </View>
  );
}

function GuestCount({ label, value }: { label: string; value: number }) {
  return (
    <View className="min-w-20 rounded-2xl bg-neutral-soft-grey-3 px-3 py-2">
      <Text className="text-sm text-neutral-grey-1">{label}</Text>
      <Text className="mt-1 font-sans-semibold text-lg text-neutral-dark-1">
        {value}
      </Text>
    </View>
  );
}

function ListCard({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <View className="rounded-3xl bg-white px-5 py-5 shadow-sm">
      <Text className="font-sans-semibold text-lg text-neutral-dark-1">
        {title}
      </Text>
      {items.length ? (
        <View className="mt-3 gap-2">
          {items.map((item, index) => (
            <View
              key={`${item}-${index}`}
              className="rounded-2xl bg-neutral-soft-grey-3 px-4 py-3"
            >
              <Text className="text-base text-neutral-dark-2">{item}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className="mt-3 text-base text-neutral-grey-1">{emptyText}</Text>
      )}
    </View>
  );
}
