import { Card } from "@/components/ui/card";
import VirtualTourStartingSceneForm from "@/features/admin/virtual-tour/forms/VirtualTourStartingSceneForm";
import type { CreateVirtualTourSceneDto } from "@/features/admin/virtual-tour/types/virtual-tour.type";
import { MapPinned } from "lucide-react";

type VirtualTourStartingStateProps = {
  onCreate: (data: CreateVirtualTourSceneDto) => Promise<void>;
};

const VirtualTourStartingState = ({
  onCreate,
}: VirtualTourStartingStateProps) => (
  <Card className="mx-auto flex w-full max-w-2xl flex-col items-center p-6 text-center sm:p-10">
    <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <MapPinned className="size-6" />
    </span>
    <h2 className="mt-5 text-xl font-semibold">Create the starting scene</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      This is the first panorama guests enter. Additional scenes will be
      created from its Navigation hotspots.
    </p>
    <VirtualTourStartingSceneForm onsubmit={onCreate} />
  </Card>
);

export default VirtualTourStartingState;
