import { useUploadVirtualTourPanoramaMutation } from "@/hooks/admin/virtual-tour.hook";
import { useMemo, useState } from "react";

const MAX_ORIGINAL_SIZE = 60 * 1024 * 1024;
const ALLOWED_ORIGINAL_TYPES = new Set(["image/jpeg", "image/png"]);
const EXPECTED_TILE_NAMES = new Set(
  Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 8 }, (_, column) => `${row}_${column}.jpg`),
  ).flat(),
);

export function useVirtualTourPanoramaUpload() {
  const [panorama, setPanoramaFile] = useState<File | null>(null);
  const [tiles, setTileFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const uploadMutation = useUploadVirtualTourPanoramaMutation();

  const tileValidation = useMemo(() => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    const invalid: string[] = [];

    tiles.forEach((tile) => {
      const filename = tile.name.toLowerCase();
      if (seen.has(filename)) duplicates.add(filename);
      seen.add(filename);

      if (tile.type !== "image/jpeg" || !EXPECTED_TILE_NAMES.has(filename)) {
        invalid.push(tile.name);
      }
    });

    return {
      duplicates: [...duplicates],
      invalid,
      missing: [...EXPECTED_TILE_NAMES].filter(
        (filename) => !seen.has(filename),
      ),
      isValid:
        tiles.length === 32 &&
        duplicates.size === 0 &&
        invalid.length === 0 &&
        seen.size === 32,
    };
  }, [tiles]);

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

  const setTiles = (files: FileList | null) => {
    setTileFiles(files ? Array.from(files) : []);
    uploadMutation.reset();
  };

  const upload = (sceneId: string) => {
    if (!panorama || originalError || !tileValidation.isValid) {
      throw new Error(
        "Choose a valid original panorama and all 32 EquiSlice files.",
      );
    }

    return uploadMutation.mutateAsync({
      sceneId,
      panorama,
      tiles: [...tiles].sort((first, second) =>
        first.name.localeCompare(second.name, undefined, { numeric: true }),
      ),
      onUploadProgress: setProgress,
    });
  };

  const reset = () => {
    setPanoramaFile(null);
    setTileFiles([]);
    setProgress(0);
    uploadMutation.reset();
  };

  return {
    panorama,
    tiles,
    tileValidation,
    originalError,
    progress,
    setPanorama,
    setTiles,
    upload,
    reset,
    status: uploadMutation.status,
    error: uploadMutation.error,
  };
}
