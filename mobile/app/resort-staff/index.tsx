import { Button } from "@/components/ui/Button";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { Input } from "@/components/ui/input";
import { useStaffBookings } from "@/hooks/staffBookings.hook";
import type { StaffBookingSummary } from "@/types/staffBooking.type";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { CalendarDays, Search, Users } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
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

  const sections = useMemo(() => {
    const todayKey = getManilaDateKey();
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
  }, [bookings]);

  const renderBooking = useCallback(
    ({ item }: { item: StaffBookingSummary }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/resort-staff/booking/[bookingId]",
            params: { bookingId: item.id },
          })
        }
        className="mb-3 rounded-3xl bg-white px-5 py-4 shadow-sm"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-sans-semibold text-xl text-neutral-dark-1">
              {item.guestName}
            </Text>
            <Text className="mt-1 text-base text-neutral-grey-1">
              {item.accommodation.name} · {item.stayOptionLabelSnapshot}
            </Text>
          </View>
          <View className="rounded-full bg-green-100 px-3 py-1">
            <Text className="text-sm font-sans-semibold text-green-700">
              Confirmed
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap gap-x-5 gap-y-2">
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

        <Text className="mt-3 text-sm text-neutral-grey-2">
          Booking ID: {item.id}
        </Text>
      </Pressable>
    ),
    [router],
  );

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <View className="px-5 pb-3 pt-4">
        <Text className="font-sans-bold text-2xl text-neutral-dark-1">
          Upcoming bookings
        </Text>
        <Text className="mt-1 text-base text-neutral-grey-1">
          Verify guests and prepare for confirmed reservations.
        </Text>

        <View className="relative mt-4">
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search guest, contact, or booking ID"
            className="pl-11"
          />
          <View className="absolute left-4 top-0 h-12 justify-center">
            <Search size={19} color="#6B7580" />
          </View>
        </View>
      </View>

      {query.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-base text-neutral-grey-1">
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
                {section.title}
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
            <View className="flex-1 items-center justify-center px-6">
              <Text className="font-sans-semibold text-xl text-neutral-dark-1">
                {query.error ? "Could not load bookings" : "No bookings found"}
              </Text>
              <Text className="mt-2 text-center text-base text-neutral-grey-1">
                {query.error
                  ? "Check your connection and try again."
                  : search
                    ? "Try a different guest name, contact number, or booking ID."
                    : "There are no confirmed upcoming bookings."}
              </Text>
              {query.error ? (
                <View className="mt-4 w-full">
                  <Button variant="outline" onPress={() => query.refetch()}>
                    <Text className="font-sans-semibold text-lg text-neutral-dark-1">
                      Retry
                    </Text>
                  </Button>
                </View>
              ) : null}
            </View>
          }
        />
      )}
    </CustomSafeAreaView>
  );
}
