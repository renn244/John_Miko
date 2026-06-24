import OperationalCard from '@/components/ui/operational-card';
import type { AssignedMaintenanceDetail } from '@/types/maintenance.type';
import { Image } from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import { Text, View } from 'react-native';

type ResolutionDetailsProps = {
  maintenance: AssignedMaintenanceDetail;
};

export function ResolutionDetails({ maintenance }: ResolutionDetailsProps) {
  return (
    <OperationalCard contentClassName="gap-3 px-4 py-4">
      <Text className="font-sans-bold text-lg text-neutral-dark-1">
        Resolution details
      </Text>
      <Text className="text-base leading-6 text-neutral-dark-1">
        {maintenance.resolutionNotes}
      </Text>

      {maintenance.resolutionProofImages?.length ? (
        <View className="flex-row gap-2">
          {maintenance.resolutionProofImages.slice(0, 3).map((imageUrl, index) => (
            <Image
              key={`${imageUrl}-${index}`}
              source={imageUrl}
              contentFit="cover"
              style={{ flex: 1, height: 90, borderRadius: 6 }}
            />
          ))}
        </View>
      ) : (
        <View className="flex-row items-center gap-2 rounded-md bg-neutral-soft-grey-3 px-3 py-3">
          <ImageOff size={18} color="#6B7280" />
          <Text className="text-base text-neutral-grey-1">
            No proof photos attached.
          </Text>
        </View>
      )}
    </OperationalCard>
  );
}
