import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVirtualTourAdminStore } from "@/store/admin/virtualTourAdmin.store";
import { useState } from "react";
import VirtualTourPanoramaUploadForm from "./VirtualTourPanoramaUploadForm";

const VirtualTourPanoramaUploadDialog = () => {
  const [isUploading, setIsUploading] = useState(false);
  const target = useVirtualTourAdminStore(
    (state) => state.panoramaUploadTarget,
  );
  const setTarget = useVirtualTourAdminStore(
    (state) => state.setPanoramaUploadTarget,
  );

  const closeDialog = () => {
    if (!isUploading) setTarget(null);
  };

  return (
    <Dialog
      open={Boolean(target)}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload panorama</DialogTitle>
          <DialogDescription>
            Add the original panorama and the complete 8 × 4 JPG export for{" "}
            {target?.name}.
          </DialogDescription>
        </DialogHeader>

        {target ? (
          <VirtualTourPanoramaUploadForm
            target={target}
            onCancel={closeDialog}
            onUploaded={() => setTarget(null)}
            onUploadingChange={setIsUploading}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTourPanoramaUploadDialog;
