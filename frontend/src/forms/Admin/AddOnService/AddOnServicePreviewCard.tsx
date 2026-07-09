import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatPeso } from "@/lib/utils";
import { Boxes, Package, Save, Tag } from "lucide-react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

type AddOnServicePreviewCardProps = {
    control: Control<{
        imageUrl: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
    }>;
    buttonText: string;
    isLoading: boolean;
    oncancel: () => void;
};

const AddOnServicePreviewCard = ({
    control,
    buttonText,
    isLoading,
    oncancel,
}: AddOnServicePreviewCardProps) => {
    const watchedImageUrl = useWatch({ control, name: "imageUrl" });
    const watchedName = useWatch({ control, name: "name" });
    const watchedDescription = useWatch({ control, name: "description" });
    const watchedPrice = useWatch({ control, name: "price" });
    const watchedQuantity = useWatch({ control, name: "quantity" });

    const previewName = watchedName?.trim() || "Add-on service name";
    const previewDescription =
        watchedDescription?.trim() || "A short service description will appear here after you fill out the form.";
    const previewPrice =
        typeof watchedPrice === "number" && Number.isFinite(watchedPrice) && watchedPrice > 0
            ? formatPeso(watchedPrice)
            : "Not set";
    const previewQuantity =
        typeof watchedQuantity === "number" && Number.isFinite(watchedQuantity) && watchedQuantity > 0
            ? `${watchedQuantity} ${watchedQuantity === 1 ? "unit" : "units"} available`
            : "Stock not set";

    return (
        <div className="space-y-4 xl:sticky xl:top-6">
            <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
                <div className="relative h-48 overflow-hidden bg-muted/50">
                    {watchedImageUrl ? (
                        <img
                        src={watchedImageUrl}
                        alt={previewName}
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted/30 px-6 text-center">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">No cover image yet</p>
                                <p className="text-xs text-muted-foreground">
                                    Upload from the Media section to preview the service card here.
                                </p>
                            </div>
                        </div>
                    )}

                    <Badge className="absolute left-3 top-3 z-10 border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none">
                        Active
                    </Badge>
                </div>

                <div className="space-y-4 p-4">
                    <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="min-w-0 text-lg font-semibold leading-tight text-foreground">
                                {previewName}
                            </h3>

                            <span className="whitespace-nowrap text-base font-semibold text-primary">
                                {previewPrice}
                            </span>
                        </div>

                        <p className="line-clamp-3 min-h-16 text-sm leading-relaxed text-muted-foreground">
                            {previewDescription}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t pt-3">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Boxes className="h-4 w-4 text-muted-foreground" />
                            {previewQuantity}
                        </span>

                        <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                            Available
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t pt-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>Catalog item</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span>Guest option</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="py-0 shadow-none">
                <CardContent className="space-y-4 px-5 py-5">
                    <p className="text-sm text-muted-foreground">
                        <span className="text-destructive">*</span> Required fields
                    </p>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row xl:flex-col">
                        <Button onClick={oncancel} type="button" variant="outline" className="w-full">
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    {buttonText}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddOnServicePreviewCard;
