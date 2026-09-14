import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

type VirtualTourLoadErrorProps = {
  message?: string;
  onRetry: () => void;
};

const VirtualTourLoadError = ({
  message,
  onRetry,
}: VirtualTourLoadErrorProps) => (
  <Card className="mx-auto max-w-xl p-6 text-center">
    <h1 className="text-xl font-semibold">Unable to load the virtual tour</h1>
    <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    <Button className="mt-5" variant="outline" onClick={onRetry}>
      <RotateCcw className="size-4" /> Try again
    </Button>
  </Card>
);

export default VirtualTourLoadError;
