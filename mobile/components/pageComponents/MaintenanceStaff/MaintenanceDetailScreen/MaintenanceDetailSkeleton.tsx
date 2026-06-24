import OperationalCard from '@/components/ui/operational-card';
import { View } from 'react-native';

export function MaintenanceSkeletonCard() {
  return (
    <OperationalCard leftAccentClassName="bg-secondary-blue-light" contentClassName="gap-4 px-4 py-4">
      <View className="h-6 w-48 rounded-md bg-neutral-soft-grey-2" />
      <View className="flex-row gap-2">
        <View className="h-8 w-24 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-8 w-24 rounded-md bg-neutral-soft-grey-2" />
      </View>
      <View className="h-px bg-neutral-soft-grey-2" />
      <View className="gap-2">
        <View className="h-4 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-4 rounded-md bg-neutral-soft-grey-2" />
        <View className="h-4 w-3/4 rounded-md bg-neutral-soft-grey-2" />
      </View>
    </OperationalCard>
  );
}

export function MaintenanceSkeletonTimeline() {
  return (
    <OperationalCard contentClassName="gap-4 px-4 py-4">
      <View className="h-6 w-24 rounded-md bg-neutral-soft-grey-2" />
      {[1, 2, 3].map((item) => (
        <View key={item} className="flex-row items-center gap-3">
          <View className="h-6 w-6 rounded-full bg-neutral-soft-grey-2" />
          <View className="gap-2">
            <View className="h-4 w-32 rounded-md bg-neutral-soft-grey-2" />
            <View className="h-4 w-44 rounded-md bg-neutral-soft-grey-2" />
          </View>
        </View>
      ))}
    </OperationalCard>
  );
}
