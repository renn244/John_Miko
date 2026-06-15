import { useCloudinaryUpload } from "@/hooks/cloudinary.hook";
import { toast } from "@/lib/toast";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus } from "lucide-react-native";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

type CloudinaryUploadProps = {
  onSuccess: (url: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
};

export function CloudinaryUpload({
  onSuccess,
  onError,
  disabled,
}: CloudinaryUploadProps) {
  const { upload, reset, status, progress } = useCloudinaryUpload();
  const isUploading = status === "uploading";

  const handleAsset = async (asset?: ImagePicker.ImagePickerAsset) => {
    if (!asset) return;

    try {
      const url = await upload(asset);
      onSuccess(url);
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error("Image upload failed."),
      );
    } finally {
      reset();
    }
  };

  const openCamera = async () => {
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
  };

  const openGallery = async () => {
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
  };

  const chooseImageSource = () => {
    Alert.alert("Add proof photo", "Choose where to get the photo.", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: openCamera },
      { text: "Photo library", onPress: openGallery },
    ]);
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
    </View>
  );
}
