import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { cn, formatPeso } from "@/lib/utils";
import { Save, Tag, UtensilsCrossed } from "lucide-react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

type MenuItemPreviewCardProps = {
    control: Control<{
        imageUrl: string;
        name: string;
        description: string;
        price: number;
        category: string;
        availability: "Available" | "Unavailable";
    }>;
    buttonText: string;
    isLoading: boolean;
    oncancel: () => void;
};

const MenuItemPreviewCard = ({
    control,
    buttonText,
    isLoading,
    oncancel,
}: MenuItemPreviewCardProps) => {
    const watchedImageUrl = useWatch({ control, name: "imageUrl" });
    const watchedName = useWatch({ control, name: "name" });
    const watchedDescription = useWatch({ control, name: "description" });
    const watchedPrice = useWatch({ control, name: "price" });
    const watchedCategory = useWatch({ control, name: "category" });
    const watchedAvailability = useWatch({ control, name: "availability" });

    const previewName = watchedName?.trim() || "Menu item name";
    const previewDescription =
        watchedDescription?.trim() || "A short dish description will appear here after you fill out the form.";
    const previewPrice =
        typeof watchedPrice === "number" && Number.isFinite(watchedPrice) && watchedPrice > 0
            ? formatPeso(watchedPrice)
            : "Not set";
    const previewCategory = watchedCategory?.trim() || "Category";
    const previewAvailability = watchedAvailability || "Available";

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
                                    Upload from the Media section to preview the menu card here.
                                </p>
                            </div>
                        </div>
                    )}

                    <Badge
                    className={cn(
                        "absolute left-3 top-3 z-10 shadow-none",
                        previewAvailability === "Available"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700",
                    )}
                    >
                        {previewAvailability}
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
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            {previewCategory}
                        </span>

                        <span
                        className={cn(
                            "inline-flex rounded-md px-2 py-1 text-xs font-medium",
                            previewAvailability === "Available"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700",
                        )}
                        >
                            {previewAvailability}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t pt-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                            <span>Guest menu</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span>{previewCategory}</span>
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
                        <Button onClick={oncancel} type="button" variant="outline" className="w-full flex-1">
                            Cancel
                        </Button>

                        <Button disabled={isLoading} type="submit" className="w-full flex-1">
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

export default MenuItemPreviewCard;
