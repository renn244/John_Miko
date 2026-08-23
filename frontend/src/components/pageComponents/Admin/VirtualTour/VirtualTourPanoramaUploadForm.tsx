import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useVirtualTourPanoramaUpload } from "@/hooks/admin/virtual-tour-panorama-upload.hook";
import { cn } from "@/lib/utils";
import {
  CircleCheck,
  ExternalLink,
  FileImage,
  Images,
  Upload,
} from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

type VirtualTourPanoramaUploadFormProps = {
  target: { id: string; name: string };
  onCancel: () => void;
  onUploaded: () => void;
  onUploadingChange: (uploading: boolean) => void;
};

const VirtualTourPanoramaUploadForm = ({
  target,
  onCancel,
  onUploaded,
  onUploadingChange,
}: VirtualTourPanoramaUploadFormProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const panoramaInputRef = useRef<HTMLInputElement>(null);
  const tilesInputRef = useRef<HTMLInputElement>(null);
  const panoramaUpload = useVirtualTourPanoramaUpload();
  const {
    panorama,
    tiles,
    tileValidation,
    originalError,
    progress,
    status,
    error,
  } = panoramaUpload;
  const isUploading = status === "pending";

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    panoramaUpload.setTiles(event.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!panorama || originalError || !tileValidation.isValid) return;

    onUploadingChange(true);
    try {
      await panoramaUpload.upload(target.id);
      toast.success("Panorama uploaded", {
        description: `${target.name} is ready for hotspot editing.`,
      });
      onUploaded();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload the panorama.",
      );
    } finally {
      onUploadingChange(false);
    }
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        void handleUpload();
      }}
    >
      <Field className="grid gap-2">
        <FieldLabel htmlFor="virtual-tour-original">
          Original panorama
        </FieldLabel>
        <button
          type="button"
          onClick={() => panoramaInputRef.current?.click()}
          className="flex min-h-24 w-full items-center gap-4 rounded-xl border border-dashed p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileImage className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {panorama?.name || "Choose original JPG or PNG"}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Approximately 2:1 aspect ratio, up to 60 MB
            </span>
          </span>
        </button>
        <Input
          ref={panoramaInputRef}
          id="virtual-tour-original"
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(event) =>
            panoramaUpload.setPanorama(event.target.files?.[0] || null)
          }
        />
        {panorama && originalError ? (
          <p role="alert" className="text-sm text-destructive">
            {originalError}
          </p>
        ) : null}
      </Field>

      <Field className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="virtual-tour-tiles">EquiSlice files</FieldLabel>
          <a
            href="https://equislice.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Open EquiSlice <ExternalLink className="size-3" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => tilesInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isDragging
              ? "border-primary bg-primary/10"
              : "hover:bg-muted/50",
          )}
        >
          <Images className="size-7 text-primary" />
          <span className="mt-3 text-sm font-semibold">
            Drop all 32 JPG slices or browse
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            Required names: 0_0.jpg through 3_7.jpg
          </span>
        </button>
        <Input
          ref={tilesInputRef}
          id="virtual-tour-tiles"
          type="file"
          accept="image/jpeg"
          multiple
          className="sr-only"
          onChange={(event) => panoramaUpload.setTiles(event.target.files)}
        />

        {tiles.length ? (
          <div className="rounded-lg bg-muted/60 p-3 text-sm">
            <p className="flex items-center gap-2 font-medium">
              {tileValidation.isValid ? (
                <CircleCheck className="size-4 text-emerald-600" />
              ) : (
                <Images className="size-4 text-amber-600" />
              )}
              {tiles.length} of 32 files selected
            </p>
            {tileValidation.invalid.length ? (
              <p className="mt-2 text-xs text-destructive">
                Invalid files: {tileValidation.invalid.slice(0, 5).join(", ")}
              </p>
            ) : null}
            {tileValidation.duplicates.length ? (
              <p className="mt-2 text-xs text-destructive">
                Duplicate names: {tileValidation.duplicates.join(", ")}
              </p>
            ) : null}
            {tileValidation.missing.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Missing: {tileValidation.missing.slice(0, 8).join(", ")}
                {tileValidation.missing.length > 8 ? "…" : ""}
              </p>
            ) : null}
          </div>
        ) : null}
      </Field>

      {isUploading ? (
        <div className="space-y-2" role="status" aria-live="polite">
          <div className="flex justify-between text-xs font-medium">
            <span>
              {progress >= 100 ? "Preparing preview…" : "Uploading files…"}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ) : null}

      {status === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {error?.message}
        </p>
      ) : null}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            Boolean(originalError) || !tileValidation.isValid || isUploading
          }
        >
          <Upload className="size-4" />
          {isUploading ? "Uploading" : "Upload panorama"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default VirtualTourPanoramaUploadForm;
