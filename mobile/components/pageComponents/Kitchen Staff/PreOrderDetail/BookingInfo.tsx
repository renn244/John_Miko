import OperationalCard from '@/components/ui/operational-card'
import StatusChip, { StatusChipTone } from '@/components/ui/status-chip'
import { formatStayLabel } from '@/lib/format'
import { KitchenOrder, KitchenOrderStatus } from '@/types/kitchenOrder.type'
import { Clock3, Users, UtensilsCrossed } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

const statusTone: Record<KitchenOrderStatus, StatusChipTone> = {
    Pending: "pending",
    Completed: "completed",
};

type BookingInfoProps = {
    order: KitchenOrder
}

const BookingInfo = ({
    order
}: BookingInfoProps) => {
    const orderStatus: KitchenOrderStatus = order?.kitchenStatus || "Pending";
    const stayLabel = order.timeSlot ? formatStayLabel(order.timeSlot)! : "-";

    return (
        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-4 px-4 py-4">
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1.5">
                    <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
                        Meal preparation
                    </Text>
                    <Text className="font-sans-bold text-xl text-neutral-dark-1">
                        {order.guestName}
                    </Text>
                    <Text className="text-base text-neutral-grey-1">
                        Booking reference: {order.referenceCode}
                    </Text>
                </View>
                <StatusChip
                    label={orderStatus}
                    tone={statusTone[orderStatus]}
                    size="sm"
                    icon={<Clock3 size={12} color={orderStatus === "Completed" ? "#047857" : "#4B5563"} />}
                />
            </View>

            <View className="flex-row flex-wrap gap-2">
                <ContextPill
                    icon={<Users size={13} color="#1F2937" />}
                    label={`${order.numberOfGuests ?? 0} guests`}
                />
                <ContextPill
                    icon={<Clock3 size={13} color="#1F2937" />}
                    label={stayLabel}
                />
                <ContextPill
                    icon={<UtensilsCrossed size={13} color="#1F2937" />}
                    label={`${order.items.length} meal ${order.items.length === 1 ? "item" : "items"}`}
                />
            </View>
        </OperationalCard>
    )
}

function ContextPill({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <View className="flex-row items-center gap-1.5 rounded-md bg-neutral-soft-grey-3 px-2.5 py-1.5">
            {icon}
            <Text className="font-sans-semibold text-sm text-neutral-dark-2">
                {label}
            </Text>
        </View>
    );
}

export default BookingInfo
