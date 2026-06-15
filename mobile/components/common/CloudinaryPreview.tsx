import { Image } from "expo-image";
import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const PREVIEW_SIZE = 112;

type CloudinaryPreviewProps = {
  images: string[];
  onRemove: (index: number) => void;
  disabled?: boolean;
};

export function CloudinaryPreview({
  images,
  onRemove,
  disabled,
}: CloudinaryPreviewProps) {
  if (images.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-3">
      {images.map((imageUrl, index) => (
        <View
          key={`${imageUrl}-${index}`}
          className="relative overflow-hidden rounded-2xl bg-neutral-soft-grey-2"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
        >
          <Image
            source={imageUrl}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={150}
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              borderRadius: 16,
            }}
          />
          <Pressable
            disabled={disabled}
            onPress={() => onRemove(index)}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-system-red disabled:opacity-50"
          >
            <Trash2 size={15} color="#FFFFFF" />
          </Pressable>
          <View className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1">
            <Text className="text-sm text-white">
              {index + 1} of {images.length}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
