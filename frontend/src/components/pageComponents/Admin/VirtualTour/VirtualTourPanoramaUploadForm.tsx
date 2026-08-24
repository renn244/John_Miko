import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useVirtualTourPanoramaUpload } from "@/hooks/admin/virtual-tour-panorama-upload.hook";
import { cn } from "@/lib/utils";
import { FileImage, Upload } from "lucide-react";
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
  const panoramaUpload = useVirtualTourPanoramaUpload();
  const { panorama, originalError, progress, status, error } = panoramaUpload;
  const isUploading = status === "pending";

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    panoramaUpload.setPanorama(event.dataTransfer.files[0] || null);
  };

  const handleUpload = async () => {
    if (!panorama || originalError) return;

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
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isDragging ? "border-primary bg-primary/10" : "hover:bg-muted/50",
          )}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileImage className="size-5" />
          </span>
          <span className="mt-3 max-w-full truncate text-sm font-semibold">
            {panorama?.name || "Drop a panorama here or browse"}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            JPG or PNG, approximately 2:1, up to 60 MB
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

      {isUploading ? (
        <div className="space-y-2" role="status" aria-live="polite">
          <div className="flex justify-between text-xs font-medium">
            <span>
              {progress >= 100 ? "Processing panorama…" : "Uploading panorama…"}
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
        <Button type="submit" disabled={Boolean(originalError) || isUploading}>
          <Upload className="size-4" />
          {isUploading ? "Uploading" : "Upload panorama"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default VirtualTourPanoramaUploadForm;
