import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip, { type StatusChipTone } from "@/components/ui/status-chip";
import { useStaffBookingById } from "@/hooks/staffBookings.hook";
import { useMyStaffReports } from "@/hooks/staffReports.hook";
import {
  getBookingStayDates,
  isBookingStayActive,
} from "@/lib/bookingStay";
import type { ReportStatus, ReportType } from "@/types/staffReport.type";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardCheck,
  ClipboardList,
  LogIn,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Wrench,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const reportTypeLabels: Record<ReportType, string> = {
  checkIn: "Check-in",
  checkOut: "Check-out",
  maintenance: "Maintenance",
};

const reportStatusTone: Record<ReportStatus, StatusChipTone> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

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
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" />
          <Text className="text-base text-neutral-grey-1">
            Loading booking details...
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (!bookingId || bookingQuery.error || !bookingQuery.data) {
    return (
      <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3 px-6">
        <View className="flex-1 items-center justify-center">
          <ScreenState
            icon={<AlertTriangle size={24} color="#AB091E" />}
            tone="danger"
            title="Booking not available"
            description="It may no longer be confirmed or upcoming."
            actionLabel={bookingId ? "Retry" : undefined}
            onAction={bookingId ? () => bookingQuery.refetch() : undefined}
          />
          <Button variant="ghost" onPress={() => router.back()} className="mt-2">
            <Text className="font-sans-semibold text-base text-neutral-dark-1">
              Go back
            </Text>
          </Button>
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
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 28,
          gap: 10,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-8 w-8 items-center justify-center">
            <ArrowLeft size={19} color="#0E33F3" />
          </Pressable>
          <Text className="font-sans-bold text-lg text-primary">
            John Miko&apos;s
          </Text>
          <View className="h-8 w-8" />
        </View>

        <View className="gap-0.5">
          <Text className="font-sans-bold text-lg text-neutral-dark-1">
            Booking details
          </Text>
          <Text className="text-sm text-neutral-grey-1">
            Reference: #{booking.id.slice(-8).toUpperCase()}
          </Text>
        </View>

        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-2 px-3 py-3">
          <View className="flex-row items-start gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-md bg-secondary-blue-light">
              <Text className="font-sans-bold text-lg text-primary">
                {booking.guestName.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-sans-bold text-base text-neutral-dark-1">
                {booking.guestName}
              </Text>
              <InfoRow icon={<Phone size={13} color="#0E33F3" />} text={booking.contactNo} />
              <InfoRow icon={<Mail size={13} color="#0E33F3" />} text={booking.email} />
            </View>
          </View>
        </OperationalCard>

        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-3 px-3 py-3">
          <SectionTitle title="Reservation timeline" />
          <View className="gap-0">
            <TimelineItem
              active
              label="Check-in"
              dateTime={format(checkIn, "MMM dd - p")}
            />
            <TimelineItem
              label="Check-out"
              dateTime={format(checkOut, "MMM dd - p")}
              isLast
            />
          </View>
        </OperationalCard>

        <OperationalCard contentClassName="gap-3 px-3 py-3">
          <SectionTitle title="Accommodation details" />
          <View className="gap-2">
            <DetailRow label="Accommodation" value={booking.accommodation.name} />
            <DetailRow label="Type" value={booking.accommodation.type} />
            <DetailRow label="Stay option" value={booking.stayOptionLabelSnapshot} />
            <DetailRow
              label="Guest breakdown"
              value={`${booking.adultGuests} Adults, ${booking.kidGuests} Children, ${booking.seniorGuest} Seniors (${booking.numberOfGuests} Total)`}
            />
          </View>
        </OperationalCard>

        <OperationalCard contentClassName="gap-3 px-3 py-3">
          <SectionTitle title="Services & orders" />
          <ServiceList
            title="Add-on services"
            emptyText="No add-on services."
            items={booking.addOns.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
            }))}
          />
          <View className="h-px bg-neutral-soft-grey-2" />
          <ServiceList
            title="Restaurant pre-orders"
            emptyText="No restaurant pre-orders."
            items={booking.preOrders.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              status: item.status,
            }))}
          />
        </OperationalCard>

        <OperationalCard leftAccentClassName="bg-secondary-blue-light" contentClassName="gap-3 px-3 py-3">
          <SectionTitle title="Special requests" />
          <View className="gap-2">
            {(booking.specialRequests?.trim()
              ? booking.specialRequests.split("\n").filter(Boolean)
              : ["No special requests."]
            ).map((request, index) => (
              <View
                key={`${request}-${index}`}
                className="rounded-sm bg-secondary-blue-light/50 px-3 py-2"
              >
                <Text className="text-base leading-5 text-neutral-dark-2">
                  {request}
                </Text>
              </View>
            ))}
          </View>
        </OperationalCard>

        <OperationalCard contentClassName="gap-2 px-3 py-3">
          <SectionTitle title="Create linked report" />
          <Text className="text-sm leading-4 text-neutral-grey-1">
            Available during guest stay ({format(checkIn, "MMM dd, p")} - {format(checkOut, "MMM dd, p")}).
          </Text>
          {!reportingOpen ? (
            <View className="rounded-md border border-secondary-yellow-light bg-secondary-yellow-light/35 px-3 py-2">
              <Text className="font-sans-semibold text-base text-neutral-dark-1">
                Report window is not open right now.
              </Text>
              <Text className="mt-1 text-sm text-neutral-grey-1">
                Reports can only be created during the active stay.
              </Text>
            </View>
          ) : null}
          <View className="gap-2 pt-1">
            <ReportAction
              disabled={!reportingOpen}
              icon={<LogIn size={15} color="#FFFFFF" />}
              label="Check-in Report"
              onPress={() => createLinkedReport("checkIn")}
            />
            <ReportAction
              disabled={!reportingOpen}
              icon={<LogOut size={15} color="#FFFFFF" />}
              label="Check-out Report"
              onPress={() => createLinkedReport("checkOut")}
            />
            <ReportAction
              disabled={!reportingOpen}
              icon={<Wrench size={15} color="#FFFFFF" />}
              label="Maintenance Report"
              onPress={() => createLinkedReport("maintenance")}
            />
          </View>
        </OperationalCard>

        <OperationalCard contentClassName="gap-3 px-3 py-3">
          <View className="flex-row items-center gap-2">
            <ClipboardCheck size={17} color="#0E33F3" />
            <SectionTitle title="My linked reports" />
          </View>

          {reportsQuery.isLoading ? (
            <ActivityIndicator className="py-3" />
          ) : reportsQuery.error ? (
            <View className="gap-3">
              <Text className="text-base text-neutral-grey-1">
                Could not load reports linked to this booking.
              </Text>
              <Button variant="outline" onPress={() => reportsQuery.refetch()}>
                <RefreshCw size={16} color="#0E33F3" />
                <Text className="font-sans-semibold text-base text-primary">
                  Retry reports
                </Text>
              </Button>
            </View>
          ) : reports.length ? (
            <View className="gap-2">
              {reports.map((report) => (
                <Pressable
                  key={report.id}
                  onPress={() =>
                    router.push({
                      pathname: "/resort-staff/reports/[reportId]",
                      params: { reportId: report.id },
                    })
                  }
                  className="rounded-sm border border-neutral-soft-grey-2 bg-neutral-soft-grey-3 px-3 py-2"
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
                    <StatusChip
                      label={report.status}
                      tone={reportStatusTone[report.status]}
                      size="sm"
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
            <View className="items-center gap-2 rounded-sm border border-dashed border-neutral-soft-grey-1 px-4 py-5">
              <ClipboardList size={22} color="#9FA8B1" />
              <Text className="text-center text-base text-neutral-grey-1">
                You have not submitted a report for this booking.
              </Text>
            </View>
          )}
        </OperationalCard>
      </ScrollView>
    </CustomSafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="font-sans-semibold text-base text-neutral-dark-1">
      {title}
    </Text>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      {icon}
      <Text className="flex-1 text-sm text-primary" selectable numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <Text className="w-28 text-sm uppercase tracking-wide text-neutral-grey-1">
        {label}
      </Text>
      <Text className="flex-1 text-right font-sans-semibold text-sm text-neutral-dark-1">
        {value}
      </Text>
    </View>
  );
}

function TimelineItem({
  active,
  label,
  dateTime,
  isLast,
}: {
  active?: boolean;
  label: string;
  dateTime: string;
  isLast?: boolean;
}) {
  return (
    <View className="flex-row gap-3">
      <View className="items-center">
        <View
          className={`h-4 w-4 rounded-full border-2 ${
            active ? "border-primary bg-primary" : "border-neutral-soft-grey-1 bg-white"
          }`}
        />
        {!isLast ? <View className="h-9 w-px bg-neutral-soft-grey-1" /> : null}
      </View>
      <View className="flex-1 pb-3">
        <Text className="text-sm uppercase tracking-wide text-neutral-grey-1">
          {label}
        </Text>
        <Text className="mt-0.5 font-sans-semibold text-base text-neutral-dark-1">
          {dateTime}
        </Text>
      </View>
    </View>
  );
}

function ServiceList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { id: string; name: string; quantity: number; status?: string }[];
  emptyText: string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm uppercase tracking-wide text-neutral-grey-1">
        {title}
      </Text>
      {items.length ? (
        <View className="gap-2">
          {items.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center justify-between gap-3 rounded-sm bg-neutral-soft-grey-3 px-3 py-2"
            >
              <View className="flex-1">
                <Text className="font-sans-semibold text-sm text-neutral-dark-1">
                  {item.name}
                </Text>
                {item.status ? (
                  <StatusChip
                    label={item.status}
                    tone={item.status === "Completed" ? "completed" : "pending"}
                    size="sm"
                    className="mt-2"
                  />
                ) : null}
              </View>
              <Text className="font-sans-semibold text-sm text-primary">
                Qty {item.quantity}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-base text-neutral-grey-1">{emptyText}</Text>
      )}
    </View>
  );
}

function ReportAction({
  disabled,
  icon,
  label,
  onPress,
}: {
  disabled: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      className="h-10 rounded-sm"
    >
      {icon}
      <Text className="font-sans-semibold text-base text-white">
        {label}
      </Text>
    </Button>
  );
}
