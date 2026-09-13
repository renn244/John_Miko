import { useUploadVirtualTourPanoramaMutation } from "@/features/admin/virtual-tour/hooks/useVirtualTourAdmin";
import { useState } from "react";

const MAX_ORIGINAL_SIZE = 60 * 1024 * 1024;
const ALLOWED_ORIGINAL_TYPES = new Set(["image/jpeg", "image/png"]);

export function useVirtualTourPanoramaUpload() {
  const [panorama, setPanoramaFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const uploadMutation = useUploadVirtualTourPanoramaMutation();

  const originalError = !panorama
    ? "Choose the original panorama."
    : !ALLOWED_ORIGINAL_TYPES.has(panorama.type)
      ? "The original must be JPG or PNG."
      : panorama.size > MAX_ORIGINAL_SIZE
        ? "The original must be 60 MB or smaller."
        : null;

  const setPanorama = (file: File | null) => {
    setPanoramaFile(file);
    uploadMutation.reset();
  };

  const upload = (sceneId: string) => {
    if (!panorama || originalError) {
      throw new Error("Choose a valid original panorama.");
    }

    return uploadMutation.mutateAsync({
      sceneId,
      panorama,
      onUploadProgress: setProgress,
    });
  };

  const reset = () => {
    setPanoramaFile(null);
    setProgress(0);
    uploadMutation.reset();
  };

  return {
    panorama,
    originalError,
    progress,
    setPanorama,
    upload,
    reset,
    status: uploadMutation.status,
    error: uploadMutation.error,
  };
}
