import axios, { isAxiosError } from "axios";
import type { ImagePickerAsset } from "expo-image-picker";

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (
  asset: ImagePickerAsset,
  onProgress?: (progress: number) => void,
) => {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary upload is not configured.");
  }

  const formData = new FormData();
  formData.append("file", {
    uri: asset.uri,
    name: asset.fileName ?? `report-${Date.now()}.jpg`,
    type: asset.mimeType ?? "image/jpeg",
  } as unknown as Blob);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          onProgress?.(Math.round((event.loaded / event.total) * 100));
        },
      },
    );

    return response.data.secure_url;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message ?? "Image upload failed.");
    }

    throw new Error("Image upload failed.");
  }
};
