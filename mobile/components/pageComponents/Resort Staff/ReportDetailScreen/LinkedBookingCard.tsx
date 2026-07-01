import OperationalCard from "@/components/ui/operational-card";
import StatusChip from "@/components/ui/status-chip";
import type { StaffReportBooking } from "@/types/staffReport.type";
import { Text, View } from "react-native";

type LinkedBookingCardProps = {
  booking: StaffReportBooking;
  formatDate: (value?: string | null) => string;
};

const bookingReferenceLabel = (id: string) => `#BKG-${id.slice(-4).toUpperCase()}`;

export function LinkedBookingCard({ booking, formatDate }: LinkedBookingCardProps) {
  return (
    <OperationalCard contentClassName="gap-3 px-5 py-4">
      <Text className="font-sans-bold text-lg text-neutral-dark-1">
        Linked booking
      </Text>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="font-sans-semibold text-base text-neutral-dark-1">
            {booking.guestName}
          </Text>
          <Text className="text-base text-neutral-grey-1">
            {booking.accommodation.name} • {booking.accommodation.type}
          </Text>
          <Text className="text-base text-neutral-grey-1">
            Booking date: {formatDate(booking.bookingDate)}
          </Text>
        </View>
        <StatusChip
          label={bookingReferenceLabel(booking.id)}
          tone="primary"
          size="sm"
        />
      </View>
    </OperationalCard>
  );
}
