import { AppBottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/Button";
import { useCloudinaryUpload } from "@/hooks/cloudinary.hook";
import { toast } from "@/lib/toast";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type CloudinaryUploadProps = {
  onSuccess: (url: string) => void;
  onError?: (error: Error) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  disabled?: boolean;
};

type ImageSource = "camera" | "library";

export function CloudinaryUpload({
  onSuccess,
  onError,
  onUploadingChange,
  disabled,
}: CloudinaryUploadProps) {
  const { upload, reset, status, progress } = useCloudinaryUpload();
  const isUploading = status === "uploading";
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const pendingSource = useRef<ImageSource | null>(null);

  const handleAsset = async (asset?: ImagePicker.ImagePickerAsset) => {
    if (!asset) return;

    onUploadingChange?.(true);

    try {
      const url = await upload(asset);
      onSuccess(url);
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error("Image upload failed."),
      );
    } finally {
      reset();
      onUploadingChange?.(false);
    }
  };

  const openCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        toast.error("Camera permission is required to take a proof photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!result.canceled) await handleAsset(result.assets[0]);
    } catch {
      toast.error("Unable to open the camera. Please try again.");
    }
  };

  const openGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.error("Photo permission is required to select a proof image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!result.canceled) await handleAsset(result.assets[0]);
    } catch {
      toast.error("Unable to open the photo library. Please try again.");
    }
  };

  const chooseImageSource = () => {
    setSourceSheetOpen(true);
  };

  const selectImageSource = (source: ImageSource) => {
    pendingSource.current = source;
    setSourceSheetOpen(false);
  };

  const handleSourceSheetClose = () => {
    setSourceSheetOpen(false);

    const source = pendingSource.current;
    pendingSource.current = null;

    if (source === "camera") {
      void openCamera();
    }

    if (source === "library") {
      void openGallery();
    }
  };

  return (
    <View className="gap-2">
      <Pressable
        disabled={disabled || isUploading}
        onPress={chooseImageSource}
        className="h-24 items-center justify-center gap-2 rounded-2xl border border-dashed border-primary bg-primary/5 disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <ActivityIndicator color="#0E33F3" />
            <Text className="font-sans-semibold text-base text-primary">
              Uploading... {progress}%
            </Text>
          </>
        ) : (
          <>
            <View className="flex-row items-center gap-2">
              <Camera size={20} color="#0E33F3" />
              <ImagePlus size={20} color="#0E33F3" />
            </View>
            <Text className="font-sans-semibold text-base text-primary">
              Add proof photo
            </Text>
          </>
        )}
      </Pressable>

      {isUploading ? (
        <View className="h-1 overflow-hidden rounded-full bg-neutral-soft-grey-2">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </View>
      ) : null}

      <AppBottomSheet
        open={sourceSheetOpen}
        onClose={handleSourceSheetClose}
        title="Add proof photo"
      >
        <Text className="text-base text-neutral-grey-1">
          Choose where to get the photo.
        </Text>
        <View className="gap-3">
          <Button
            variant="outline"
            className="justify-start gap-3"
            onPress={() => selectImageSource("camera")}
          >
            <Camera size={20} color="#0E33F3" />
            <Text className="font-sans-semibold text-base text-neutral-dark-1">
              Camera
            </Text>
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-3"
            onPress={() => selectImageSource("library")}
          >
            <ImagePlus size={20} color="#0E33F3" />
            <Text className="font-sans-semibold text-base text-neutral-dark-1">
              Photo library
            </Text>
          </Button>
          <Button variant="ghost" onPress={() => setSourceSheetOpen(false)}>
            <Text className="font-sans-semibold text-base text-neutral-dark-1">
              Cancel
            </Text>
          </Button>
        </View>
      </AppBottomSheet>
    </View>
  );
}
