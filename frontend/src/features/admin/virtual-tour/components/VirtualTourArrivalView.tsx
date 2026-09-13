import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocateFixed } from "lucide-react";

type VirtualTourArrivalToolbarProps = {
  hotspotLabel: string;
  isPending: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export const VirtualTourArrivalToolbar = ({
  hotspotLabel,
  isPending,
  onCancel,
  onSave,
}: VirtualTourArrivalToolbarProps) => (
  <div className="mb-3 flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <LocateFixed className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">
          Set arrival view for “{hotspotLabel}”
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Rotate the destination panorama, then use the current view.
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button type="button" size="sm" onClick={onSave} disabled={isPending}>
        Use current view
      </Button>
    </div>
  </div>
);

export const VirtualTourArrivalInspector = () => (
  <Card className="min-w-0 p-5 xl:h-full">
    <p className="text-xs font-semibold text-primary">Arrival view</p>
    <h2 className="mt-2 text-lg font-semibold">Orient the destination</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">
      This optional direction applies only when guests use this specific
      Navigation hotspot. Cancel to keep the scene’s default view.
    </p>
  </Card>
);
