import OperationalCard from "@/components/ui/operational-card";
import { format } from "date-fns";
import { Text, View } from "react-native";
import { SectionTitle } from "./SectionTitle";

type ReservationTimelineCardProps = {
  checkIn: Date;
  checkOut: Date;
};

export function ReservationTimelineCard({
  checkIn,
  checkOut,
}: ReservationTimelineCardProps) {
  return (
    <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-3 px-3 py-3">
      <SectionTitle title="Reservation timeline" />
      <View className="gap-0">
        <TimelineItem active label="Check-in" dateTime={format(checkIn, "MMM dd - p")} />
        <TimelineItem label="Check-out" dateTime={format(checkOut, "MMM dd - p")} isLast />
      </View>
    </OperationalCard>
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
