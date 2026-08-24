import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
  NewVirtualTourHotspot,
  PanoramaPosition,
} from "@/types/admin/virtual-tour.type";
import { ArrowRight, Info, X } from "lucide-react";
import VirtualTourInformationHotspotEditor from "./VirtualTourInformationHotspotEditor";
import VirtualTourNavigationHotspotEditor from "./VirtualTourNavigationHotspotEditor";

type VirtualTourHotspotInspectorProps = {
  sourceScene: AdminVirtualTourScene;
  scenes: AdminVirtualTourScene[];
  hotspot: AdminVirtualTourHotspot | null;
  newHotspot: NewVirtualTourHotspot | null;
  positionOverride: PanoramaPosition | null;
  onDirtyChange: (dirty: boolean) => void;
  onCancel: () => void;
  onSaved: (hotspotId: string) => void;
  onMove: () => void;
  onConnectedSceneCreated: (scene: { id: string; name: string }) => void;
  onBeginArrivalCapture: (hotspot: AdminVirtualTourHotspot) => void;
};

const VirtualTourHotspotInspector = ({
  sourceScene,
  scenes,
  hotspot,
  newHotspot,
  positionOverride,
  onDirtyChange,
  onCancel,
  onSaved,
  onMove,
  onConnectedSceneCreated,
  onBeginArrivalCapture,
}: VirtualTourHotspotInspectorProps) => {
  const type = hotspot?.type || newHotspot?.type || "INFORMATION";
  const position =
    positionOverride ||
    newHotspot?.position ||
    (hotspot ? { yaw: hotspot.yaw, pitch: hotspot.pitch } : null);

  if (!position) return null;

  return (
    <Card className="min-w-0 gap-5 p-4 xl:h-full xl:min-h-0 xl:overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="outline" className="gap-1.5">
            {type === "NAVIGATION" ? (
              <ArrowRight className="size-3.5" />
            ) : (
              <Info className="size-3.5" />
            )}
            {type === "NAVIGATION" ? "Navigation" : "Information"}
          </Badge>
          <h2 className="mt-3 text-lg font-semibold">
            {hotspot ? hotspot.label : "New hotspot"}
          </h2>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Close hotspot editor"
          onClick={onCancel}
        >
          <X className="size-4" />
        </Button>
      </div>

      {type === "NAVIGATION" ? (
        <VirtualTourNavigationHotspotEditor
          sourceScene={sourceScene}
          scenes={scenes}
          hotspot={hotspot}
          position={position}
          positionChanged={Boolean(positionOverride)}
          onDirtyChange={onDirtyChange}
          onSaved={onSaved}
          onMove={onMove}
          onConnectedSceneCreated={onConnectedSceneCreated}
          onBeginArrivalCapture={onBeginArrivalCapture}
        />
      ) : (
        <VirtualTourInformationHotspotEditor
          sourceScene={sourceScene}
          hotspot={hotspot}
          position={position}
          positionChanged={Boolean(positionOverride)}
          onDirtyChange={onDirtyChange}
          onSaved={onSaved}
          onMove={onMove}
        />
      )}
    </Card>
  );
};

export default VirtualTourHotspotInspector;
