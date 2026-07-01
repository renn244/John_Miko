import OperationalCard from "@/components/ui/operational-card";
import SectionTitle from "@/components/ui/section-title";
import type { StaffBookingDetails } from "@/types/staffBooking.type";
import { Text, View } from "react-native";

type AccommodationDetailsCardProps = {
  booking: StaffBookingDetails;
};

export function AccommodationDetailsCard({
  booking,
}: AccommodationDetailsCardProps) {
  return (
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
