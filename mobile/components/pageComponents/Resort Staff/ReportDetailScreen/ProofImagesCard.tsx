import { FullScreenImageViewer } from "@/components/common/FullScreenImageViewer";
import OperationalCard from "@/components/ui/operational-card";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type ProofImagesCardProps = {
  proofImages: string[];
};

export function ProofImagesCard({ proofImages }: ProofImagesCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  return (
    <OperationalCard contentClassName="gap-3 px-5 py-4">
      <View className="flex-row items-baseline gap-2">
        <Text className="font-sans-bold text-lg text-neutral-dark-1">
          Proof photos
        </Text>
        <Text className="text-base text-neutral-grey-1">
          ({proofImages.length} photos)
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {proofImages.map((imageUrl, index) => (
          <Pressable
            key={`${imageUrl}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={`View proof photo ${index + 1} of ${proofImages.length}`}
            onPress={() => setActiveImageIndex(index)}
            className="overflow-hidden rounded-md bg-neutral-soft-grey-2"
            style={{ width: "47%", aspectRatio: 1 }}
          >
            <Image
              source={imageUrl}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={150}
              style={{ width: "100%", height: "100%" }}
            />
          </Pressable>
        ))}
      </View>

      <FullScreenImageViewer
        images={proofImages}
        initialIndex={activeImageIndex ?? 0}
        visible={activeImageIndex !== null}
        onClose={() => setActiveImageIndex(null)}
      />
    </OperationalCard>
  );
}
