import OperationalCard from "@/components/ui/operational-card";
import type { StaffBookingDetails } from "@/types/staffBooking.type";
import { Mail, Phone } from "lucide-react-native";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

type GuestDetailsCardProps = {
  booking: StaffBookingDetails;
};

export function GuestDetailsCard({ booking }: GuestDetailsCardProps) {
  return (
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
