import axios, { isAxiosError } from "axios";
import type { ImagePickerAsset } from "expo-image-picker";
import apiClient from "@/lib/apiClient";
import type { MediaPurpose, UploadSignatureResponse } from "@/types/media.type";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadImageToCloudinary = async (
  asset: ImagePickerAsset,
  purpose: MediaPurpose,
  onProgress?: (progress: number) => void,
) => {
  const mimeType = asset.mimeType ?? "image/jpeg";

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }

  if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  const signatureResponse = await apiClient.post<UploadSignatureResponse>(
    "/media/upload-signature",
    { purpose },
  );

  if (signatureResponse.status < 200 || signatureResponse.status >= 300) {
    const responseData = signatureResponse.data as UploadSignatureResponse & {
      message?: string;
    };
    throw new Error(responseData.message || "Unable to authorize image upload.");
  }

  const signedUpload = signatureResponse.data;

  const formData = new FormData();
  formData.append("file", {
    uri: asset.uri,
    name: asset.fileName ?? `report-${Date.now()}.jpg`,
    type: mimeType,
  } as unknown as Blob);
  formData.append("api_key", signedUpload.apiKey);
  formData.append("timestamp", String(signedUpload.timestamp));
  formData.append("signature", signedUpload.signature);
  formData.append("upload_preset", signedUpload.uploadPreset);
  formData.append("public_id", signedUpload.publicId);
  formData.append("type", signedUpload.deliveryType);

  try {
    const response = await axios.post<{ secure_url: string; public_id: string }>(
      signedUpload.uploadUrl,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          onProgress?.(Math.round((event.loaded / event.total) * 100));
        },
      },
    );

    if (response.data.public_id !== signedUpload.publicId) {
      throw new Error("Cloudinary returned an unexpected media identifier.");
    }

    const uploadedUrl = signedUpload.visibility === "private"
      ? signedUpload.deliveryUrl
      : response.data.secure_url;

    if (!uploadedUrl) {
      throw new Error("Cloudinary did not return a usable image URL.");
    }

    return uploadedUrl;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message ?? "Image upload failed.");
    }

    throw new Error("Image upload failed.");
  }
};
