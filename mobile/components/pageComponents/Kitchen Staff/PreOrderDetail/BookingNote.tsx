import OperationalCard from '@/components/ui/operational-card';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

type BookingNoteProps = {
    notes: string;
}

const BookingNote = ({ notes }: BookingNoteProps) => {
    return (
        <OperationalCard
            leftAccentClassName="bg-system-red"
            className="bg-secondary-blue-light/40"
            contentClassName="gap-2 px-4 py-4"
        >
            <View className="flex-row items-start gap-3">
                <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-system-red/10">
                    <AlertTriangle size={16} color="#AB091E" />
                </View>
                <View className="flex-1 gap-1">
                    <Text className="font-sans-bold text-lg text-neutral-dark-1">
                        Dietary / service note
                    </Text>
                    <Text className="text-base leading-5 text-neutral-dark-2">
                        {notes}
                    </Text>
                </View>
            </View>
        </OperationalCard>
    )
}

export default BookingNote;
