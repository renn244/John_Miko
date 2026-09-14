import { useDeleteVirtualTourSceneMutation } from "@/features/admin/virtual-tour/hooks/useVirtualTourAdmin";
import { useVirtualTourAdminStore } from "@/features/admin/virtual-tour/store/virtualTourAdmin.store";
import { toast } from "sonner";
import VirtualTourDeleteDialog from "./VirtualTourDeleteDialog";

type VirtualTourSceneDeleteDialogProps = {
  onDeleted: (sceneId: string) => void;
};

const VirtualTourSceneDeleteDialog = ({
  onDeleted,
}: VirtualTourSceneDeleteDialogProps) => {
  const target = useVirtualTourAdminStore((state) => state.deleteSceneTarget);
  const setTarget = useVirtualTourAdminStore(
    (state) => state.setDeleteSceneTarget,
  );
  const deleteScene = useDeleteVirtualTourSceneMutation();

  const handleDelete = async () => {
    if (!target) return;
    try {
      await deleteScene.mutateAsync(target.id);
      setTarget(null);
      onDeleted(target.id);
      toast.success("Scene deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete the scene.",
      );
    }
  };

  return (
    <VirtualTourDeleteDialog
      open={Boolean(target)}
      title={`Delete ${target?.name || "this scene"}?`}
      description="This permanently removes the scene and its outgoing hotspots."
      isPending={deleteScene.isPending}
      onOpenChange={(open) => {
        if (!open && !deleteScene.isPending) setTarget(null);
      }}
      onConfirm={() => void handleDelete()}
    />
  );
};

export default VirtualTourSceneDeleteDialog;
