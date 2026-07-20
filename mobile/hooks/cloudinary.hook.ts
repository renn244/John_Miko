import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import type { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import type { MediaPurpose } from "@/types/media.type";

type UploadStatus = "idle" | "uploading" | "done" | "error";

export function useCloudinaryUpload() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const upload = async (asset: ImagePickerAsset, purpose: MediaPurpose) => {
    setStatus("uploading");
    setProgress(0);
    setError(null);

    try {
      const uploadedUrl = await uploadImageToCloudinary(asset, purpose, setProgress);
      setUrl(uploadedUrl);
      setStatus("done");
      return uploadedUrl;
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      setError(message);
      setStatus("error");
      throw new Error(message);
    }
  };

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setUrl("");
    setError(null);
  };

  return { upload, reset, status, progress, url, error };
}
