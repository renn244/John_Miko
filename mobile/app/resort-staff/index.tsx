import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { Input } from "@/components/ui/input";
import OperationalCard from "@/components/ui/operational-card";
import ScreenState from "@/components/ui/screen-state";
import StatusChip from "@/components/ui/status-chip";
import { useStaffBookings } from "@/hooks/staffBookings.hook";
import type { StaffBookingSummary } from "@/types/staffBooking.type";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { CalendarDays, Search, SearchX, Users, WifiOff } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";

const getManilaDateKey = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
};

const getDateKey = (value: string) => value.slice(0, 10);

const formatBookingDate = (value: string) => {
  const date = parseISO(getDateKey(value));
  return Number.isNaN(date.getTime()) ? value : format(date, "MMM dd, yyyy");
};

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, value]);

  return debounced;
}

export default function ResortStaffBookingsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const query = useStaffBookings(debouncedSearch);

  const bookings = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  const todayKey = getManilaDateKey();
  const sections = useMemo(() => {
    const today = bookings.filter(
      (booking) => getDateKey(booking.bookingDate) === todayKey,
    );
    const upcoming = bookings.filter(
      (booking) => getDateKey(booking.bookingDate) !== todayKey,
    );

    return [
      ...(today.length ? [{ title: "Today", data: today }] : []),
      ...(upcoming.length ? [{ title: "Upcoming", data: upcoming }] : []),
    ];
  }, [bookings, todayKey]);
  const todayCount = sections.find((section) => section.title === "Today")?.data.length ?? 0;
  const upcomingCount = sections.find((section) => section.title === "Upcoming")?.data.length ?? 0;
  const hasSearch = search.trim().length > 0;

  const renderBooking = useCallback(
    ({ item }: { item: StaffBookingSummary }) => {
      const isToday = getDateKey(item.bookingDate) === todayKey;

      return (
        <OperationalCard
          onPress={() =>
            router.push({
              pathname: "/resort-staff/booking/[bookingId]",
              params: { bookingId: item.id },
            })
          }
          className="mb-3"
          leftAccentClassName={isToday ? "bg-secondary-yellow-light" : "bg-primary"}
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1" numberOfLines={1}>
                {item.guestName}
              </Text>
              <Text className="mt-1 text-base text-neutral-grey-1" numberOfLines={1}>
                {item.accommodation.name} - {item.stayOptionLabelSnapshot}
              </Text>
            </View>
            <Text className="text-sm font-sans-semibold text-neutral-grey-2">
              #{item.id.slice(-8).toUpperCase()}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-x-5 gap-y-2">
            <View className="flex-row items-center gap-2">
              <CalendarDays size={17} color="#6B7580" />
              <Text className="text-base text-neutral-grey-1">
                {formatBookingDate(item.bookingDate)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Users size={17} color="#6B7580" />
              <Text className="text-base text-neutral-grey-1">
                {item.numberOfGuests} guest
                {item.numberOfGuests === 1 ? "" : "s"}
              </Text>
            </View>
          </View>

          <Text className="text-sm text-neutral-grey-2" numberOfLines={1}>
            Booking ID: {item.id}
          </Text>
        </OperationalCard>
      );
    },
    [router, todayKey],
  );

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="gap-4 px-5 pb-3 pt-4">
        <View className="gap-3">
          <Text className="font-sans-bold text-2xl text-primary">
            John Miko&apos;s
          </Text>
          <View className="gap-1">
            <Text className="font-sans-bold text-2xl text-neutral-dark-1">
              Upcoming bookings
            </Text>
            <Text className="text-base leading-5 text-neutral-grey-1">
              Verify guests and prepare for confirmed reservations.
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <StatusChip label={`Today ${todayCount}`} tone="pending" size="sm" />
          <StatusChip label={`Upcoming ${upcomingCount}`} tone="primary" size="sm" />
          <StatusChip label="Confirmed" tone="confirmed" size="sm" />
        </View>

        <View className="relative">
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search guest, contact, or booking ID"
            surface="white"
            leftIcon={<Search size={19} color="#6B7580" />}
          />
        </View>
      </View>

      {query.isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" />
          <Text className="text-base text-neutral-grey-1">
            Loading bookings...
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          renderSectionHeader={({ section }) => (
            <View className="bg-neutral-soft-grey-3 pb-2 pt-3">
              <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 28,
            flexGrow: bookings.length === 0 ? 1 : undefined,
          }}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              onRefresh={() => query.refetch()}
            />
          }
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              query.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator className="py-5" />
            ) : null
          }
          ListEmptyComponent={
            <ScreenState
              icon={
                query.error ? (
                  <WifiOff size={24} color="#AB091E" />
                ) : (
                  <SearchX size={24} color="#0E33F3" />
                )
              }
              tone={query.error ? "danger" : "info"}
              title={
                query.error
                  ? "Could not load bookings"
                  : hasSearch
                    ? "No bookings found"
                    : "No confirmed upcoming bookings"
              }
              description={
                query.error
                  ? "Check your connection and try again."
                  : hasSearch
                    ? "Try a different guest name, contact number, or booking ID."
                    : "There are no confirmed reservations to prepare right now."
              }
              className="flex-1"
              actionLabel={query.error ? "Retry" : undefined}
              onAction={query.error ? () => query.refetch() : undefined}
            />
          }
        />
      )}
    </CustomSafeAreaView>
  );
}
