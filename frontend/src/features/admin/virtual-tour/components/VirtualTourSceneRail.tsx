import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isPanoramaReady } from "@/features/admin/virtual-tour/types/virtual-tour.type";
import type { AdminVirtualTourScene } from "@/features/admin/virtual-tour/types/virtual-tour.type";
import { CircleDot, ImageOff, MapPinned } from "lucide-react";
import { virtualTourSceneStatusStyles } from "./virtual-tour-admin";

type VirtualTourSceneRailProps = {
  scenes: AdminVirtualTourScene[];
  selectedSceneId: string;
  startingSceneId: string | null;
  onSelect: (sceneId: string) => void;
};

const VirtualTourSceneRail = ({
  scenes,
  selectedSceneId,
  startingSceneId,
  onSelect,
}: VirtualTourSceneRailProps) => (
  <Card className="min-w-0 max-w-full gap-3 bg-card/80 p-3 xl:h-full xl:min-h-0 xl:overflow-hidden">
    <div className="px-1">
      <h2 className="text-sm font-semibold">Scenes</h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        New scenes are created from navigation hotspots.
      </p>
    </div>

    <div className="admin-tour-scene-strip flex min-h-0 flex-1 gap-2 overflow-x-auto pb-1 xl:block xl:space-y-2 xl:overflow-y-auto xl:pr-1 xl:pb-0">
      {scenes.map((scene) => {
        const isSelected = scene.id === selectedSceneId;
        const isStarting = scene.id === startingSceneId;
        const panoramaReady = isPanoramaReady(scene);
        const PanoramaIcon = panoramaReady ? CircleDot : ImageOff;

        return (
          <button
            key={scene.id}
            type="button"
            onClick={() => onSelect(scene.id)}
            aria-current={isSelected ? "true" : undefined}
            className={cn(
              "group w-56 shrink-0 overflow-hidden rounded-xl border text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:w-full",
              isSelected ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            {scene.previewUrl ? (
              <div className="relative aspect-[16/7] overflow-hidden bg-muted">
                <img
                  src={scene.previewUrl}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-2 px-3 pt-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{scene.name}</p>
                {isStarting ? (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
                    <MapPinned className="size-3.5" /> Starting scene
                  </p>
                ) : null}
              </div>
              <Badge
                className={cn(
                  "shrink-0 capitalize",
                  virtualTourSceneStatusStyles[scene.status],
                )}
              >
                {scene.status.toLowerCase()}
              </Badge>
            </div>

            <p className="flex items-center gap-1.5 px-3 pb-3 pt-2 text-xs text-muted-foreground">
              <PanoramaIcon className="size-3.5" />
              {panoramaReady ? "Panorama ready" : "No panorama"}
            </p>
          </button>
        );
      })}
    </div>
  </Card>
);

export default VirtualTourSceneRail;
