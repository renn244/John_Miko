import OperationalCard from '@/components/ui/operational-card';
import SectionTitle from '@/components/ui/section-title';
import { KitchenOrder } from '@/types/kitchenOrder.type';
import { Mail, Phone } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

type BookingContactProps = {
    order: KitchenOrder;
}

const BookingContact = ({
    order
}: BookingContactProps) => {
    return (
        <OperationalCard leftAccentClassName="bg-primary" contentClassName="gap-3 px-4 py-4">
            <SectionTitle
                title="Guest contact"
            />
            <View className="gap-2.5">
                <ContactRow
                icon={<Phone size={15} color="#0E33F3" />}
                label="Phone"
                text={order.contactNo || "No contact number"}
                />
                <ContactRow
                icon={<Mail size={15} color="#0E33F3" />}
                label="Email"
                text={order.email || "No email available"}
                />
            </View>
        </OperationalCard>
    )
}

function ContactRow({
    icon,
    label,
    text,
}: {
    icon: React.ReactNode;
    label: string;
    text: string;
}) {
    return (
        <View className="flex-row items-center gap-3 rounded-md bg-neutral-soft-grey-3 px-3 py-2.5">
            <View className="h-8 w-8 items-center justify-center rounded-md bg-secondary-blue-light">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="font-sans-semibold text-xs uppercase tracking-wide text-neutral-grey-1">
                    {label}
                </Text>
                <Text className="text-base text-neutral-dark-2">{text}</Text>
            </View>
        </View>
    );
}

export default BookingContact