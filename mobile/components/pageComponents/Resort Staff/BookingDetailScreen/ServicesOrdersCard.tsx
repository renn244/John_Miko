import OperationalCard from "@/components/ui/operational-card";
import SectionTitle from "@/components/ui/section-title";
import StatusChip from "@/components/ui/status-chip";
import type { StaffBookingAddOn, StaffBookingDetails, StaffBookingPreOrder } from "@/types/staffBooking.type";
import { Text, View } from "react-native";

type ServicesOrdersCardProps = {
  booking: StaffBookingDetails;
};

export function ServicesOrdersCard({ booking }: ServicesOrdersCardProps) {
  return (
    <OperationalCard contentClassName="gap-3 px-3 py-3">
      <SectionTitle title="Services & orders" />
      <ServiceList
        title="Add-on services"
        emptyText="No add-on services."
        items={booking.addOns}
      />
      <View className="h-px bg-neutral-soft-grey-2" />
      <ServiceList
        title="Restaurant pre-orders"
        emptyText="No restaurant pre-orders."
        items={booking.preOrders}
      />
    </OperationalCard>
  );
}

function ServiceList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: (StaffBookingAddOn | StaffBookingPreOrder)[];
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
                {"status" in item ? (
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
