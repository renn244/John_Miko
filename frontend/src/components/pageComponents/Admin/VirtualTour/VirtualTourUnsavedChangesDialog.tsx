import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VirtualTourUnsavedChangesDialogProps = {
  open: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
};

const VirtualTourUnsavedChangesDialog = ({
  open,
  onKeepEditing,
  onDiscard,
}: VirtualTourUnsavedChangesDialogProps) => (
  <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onKeepEditing()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Discard unsaved changes?</DialogTitle>
        <DialogDescription>
          Your changes in the current inspector have not been saved.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onKeepEditing}>
          Keep editing
        </Button>
        <Button type="button" variant="destructive" onClick={onDiscard}>
          Discard changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default VirtualTourUnsavedChangesDialog;
