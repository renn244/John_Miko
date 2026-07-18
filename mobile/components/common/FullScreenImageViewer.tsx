import { Image } from "expo-image";
import { Gallery } from "react-native-zoom-toolkit";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageOff, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type FullScreenImageViewerProps = {
  images: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
};

type ImageLoadState = "loading" | "loaded" | "error";

function GalleryImage({ imageUrl }: { imageUrl: string }) {
  const { width, height } = useWindowDimensions();
  const [loadState, setLoadState] = useState<ImageLoadState>("loading");

  useEffect(() => {
    setLoadState("loading");
  }, [imageUrl]);

  return (
    <View style={{ width, height }} className="items-center justify-center">
      <Image
        source={imageUrl}
        contentFit="contain"
        cachePolicy="memory-disk"
        onLoad={() => setLoadState("loaded")}
        onError={() => setLoadState("error")}
        style={{ width, height }}
      />

      {loadState === "loading" ? (
        <View className="absolute items-center justify-center gap-3">
          <ActivityIndicator color="#FFFFFF" size="large" />
          <Text className="text-sm text-white">Loading photo…</Text>
        </View>
      ) : null}

      {loadState === "error" ? (
        <View className="absolute items-center gap-3 px-8">
          <ImageOff size={32} color="#FFFFFF" />
          <Text className="text-center text-base text-white">
            This photo could not be loaded.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function FullScreenImageViewer({
  images,
  initialIndex,
  visible,
  onClose,
}: FullScreenImageViewerProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)));
    }
  }, [images.length, initialIndex, visible]);

  const renderItem = useCallback(
    (imageUrl: string) => <GalleryImage imageUrl={imageUrl} />,
    [],
  );

  if (!visible || images.length === 0) return null;

  return (
    <Modal
      visible
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <View style={{ flex: 1, backgroundColor: "#000000" }}>
          <Gallery
            key={`${images.length}-${initialIndex}`}
            data={images}
            initialIndex={currentIndex}
            keyExtractor={(imageUrl, index) => `${imageUrl}-${index}`}
            renderItem={renderItem}
            maxScale={5}
            onIndexChange={setCurrentIndex}
          />
        </View>

        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: insets.top + 12,
            left: 16,
            right: 16,
            alignItems: "center",
          }}
        >
          <View className="rounded-md bg-black/60 px-3 py-2">
            <Text className="font-sans-semibold text-sm text-white">
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close photo viewer"
            hitSlop={8}
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-md bg-black/60"
            style={{ position: "absolute", right: 0 }}
          >
            <X size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
