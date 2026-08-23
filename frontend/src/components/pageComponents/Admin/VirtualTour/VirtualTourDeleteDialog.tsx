import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";

type VirtualTourDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const VirtualTourDeleteDialog = ({
  open,
  title,
  description,
  isPending,
  onOpenChange,
  onConfirm,
}: VirtualTourDeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? <LoadingSpinner /> : null}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default VirtualTourDeleteDialog;
