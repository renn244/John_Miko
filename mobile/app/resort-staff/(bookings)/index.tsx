import BookingCard from "@/components/pageComponents/Resort Staff/BookingList/BookingCard";
import BookingListFilter from "@/components/pageComponents/Resort Staff/BookingList/BookingListFilter";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import ScreenState from "@/components/ui/screen-state";
import StatusChip from "@/components/ui/status-chip";
import { useStaffBookings } from "@/hooks/staffBookings.hook";
import { useStaffReportsBookingFilterStore } from "@/store/staffReportsBooking.store";
import { useRoleTourAutoStart } from "@/hooks/roleTours/useRoleTourAutoStart";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SearchX, WifiOff } from "lucide-react-native";
import { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";

const getDateKey = (value: string) => value.slice(0, 10);

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

export default function ResortStaffBookingsScreen() {
  useRoleTourAutoStart("RESORT_STAFF");
  const tabBarHeight = useBottomTabBarHeight();
  const search = useStaffReportsBookingFilterStore((state) => state.search);

  const query = useStaffBookings(search);

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

  const hasSearch = search.trim().length > 0;

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <BookingListFilter />

      {query.isLoading ? (
        <LoadingState />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookingCard item={item} todayKey={todayKey} />}
          renderSectionHeader={({ section }) => (
            <View className="bg-neutral-soft-grey-3 pb-2 pt-3">
              <StatusChip
                label={`${section.title} ${section.data.length}`}
                tone={section.title === "Today" ? "pending" : "primary"}
                size="md"
              />
            </View>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: tabBarHeight + 24,
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
            query.isError ? (
              <ErrorState refetch={query.refetch} />
            ) : (
              <NotFoundState hasSearch={hasSearch} />
            )              
          }
        />
      )}
    </CustomSafeAreaView>
  );
}

const LoadingState = () => (
  <View className="flex-1 items-center justify-center gap-3">
    <ActivityIndicator size="large" />
    <Text className="text-base text-neutral-grey-1">
      Loading bookings...
    </Text>
  </View>
)

type ErrorStateProps = {
  refetch: () => void;
}

const ErrorState = ({
  refetch
}: ErrorStateProps) => {
  return (
    <ScreenState 
    icon={<WifiOff size={24} color="#AB091E" />}
    tone="danger"
    title="Could not load bookings"
    description="Check your connection and try again."
    actionLabel="Retry"
    onAction={refetch}
    />
  )
}

type NotFoundStateProps = {
  hasSearch: boolean;
}

const NotFoundState = ({
  hasSearch
}: NotFoundStateProps) => {
  return (
    <ScreenState 
    icon={<SearchX size={24} color="#0E33F3" />}
    tone="info"
    title={hasSearch ? "No bookings found" : "No confirmed upcoming bookings"}
      description={
        hasSearch ? 
        "Try a different guest name, contact number, or booking reference." : 
        "There are no confirmed reservations to prepare right now."
      }
    />
  )
}
