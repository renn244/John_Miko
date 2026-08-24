import { useDeleteVirtualTourHotspotMutation } from "@/hooks/admin/virtual-tour.hook";
import { useVirtualTourAdminStore } from "@/store/admin/virtualTourAdmin.store";
import { toast } from "sonner";
import VirtualTourDeleteDialog from "./VirtualTourDeleteDialog";

type VirtualTourHotspotDeleteDialogProps = {
  onDeleted: () => void;
};

const VirtualTourHotspotDeleteDialog = ({
  onDeleted,
}: VirtualTourHotspotDeleteDialogProps) => {
  const target = useVirtualTourAdminStore(
    (state) => state.deleteHotspotTarget,
  );
  const setTarget = useVirtualTourAdminStore(
    (state) => state.setDeleteHotspotTarget,
  );
  const deleteHotspot = useDeleteVirtualTourHotspotMutation();

  const handleDelete = async () => {
    if (!target) return;
    try {
      await deleteHotspot.mutateAsync(target.id);
      setTarget(null);
      onDeleted();
      toast.success("Hotspot deleted");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the hotspot.",
      );
    }
  };

  return (
    <VirtualTourDeleteDialog
      open={Boolean(target)}
      title="Delete this hotspot?"
      description={`Guests will no longer see or use “${target?.label || "this hotspot"}”.`}
      isPending={deleteHotspot.isPending}
      onOpenChange={(open) => {
        if (!open && !deleteHotspot.isPending) setTarget(null);
      }}
      onConfirm={() => void handleDelete()}
    />
  );
};

export default VirtualTourHotspotDeleteDialog;
