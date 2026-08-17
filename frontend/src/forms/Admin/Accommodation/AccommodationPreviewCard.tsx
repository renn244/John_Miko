import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatPeso } from "@/lib/utils";
import { Save, Tag, Users } from "lucide-react";
import type { AccommodationFormValues } from "./accommodationForm.schema";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

type AccommodationPreviewCardProps = {
    control: Control<AccommodationFormValues>;
    buttonText: string;
    isLoading: boolean;
    oncancel: () => void;
};

const AccommodationPreviewCard = ({
    control,
    buttonText,
    isLoading,
    oncancel,
}: AccommodationPreviewCardProps) => {
    const watchedName = useWatch({ control, name: "name" });
    const watchedType = useWatch({ control, name: "type" });
    const watchedCapacity = useWatch({ control, name: "capacity" });
    const watchedPrice = useWatch({ control, name: "price" });
    const watchedImageUrl = useWatch({ control, name: "imageUrl" });
    const watchedDescription = useWatch({ control, name: "description" });
    const watchedAmenities = useWatch({ control, name: "amenities" });

    const previewName = watchedName?.trim() || "Accommodation name";
    const previewType = watchedType || "Room";
    const previewCapacity =
        typeof watchedCapacity === "number" && Number.isFinite(watchedCapacity) && watchedCapacity > 0
            ? `${watchedCapacity} pax`
            : "Not set";
    const previewPrice =
        typeof watchedPrice === "number" && Number.isFinite(watchedPrice) && watchedPrice > 0
            ? formatPeso(watchedPrice)
            : "Not set";
    const previewDescription = watchedDescription?.trim() || "A short accommodation description will appear here once you fill it out.";
    const previewAmenities = watchedAmenities?.filter(Boolean) ?? [];

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
                                    Upload from the Media section to preview the accommodation card here.
                                </p>
                            </div>
                        </div>
                    )}

                    <Badge className="absolute left-3 top-3 z-10 capitalize shadow-none">
                        {previewType}
                    </Badge>
                </div>

                <div className="space-y-4 p-4">
                    <div className="space-y-1.5">
                        <p className="text-lg font-semibold text-foreground">{previewName}</p>
                        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                            {previewDescription}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{previewCapacity}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span>{previewPrice}</span>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <div className="flex flex-wrap gap-1.5">
                            {previewAmenities.slice(0, 3).map((amenity, index) => (
                                <span
                                key={`${amenity}-${index}`}
                                className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                                >
                                    {amenity}
                                </span>
                            ))}

                            {previewAmenities.length > 3 && (
                                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                    +{previewAmenities.length - 3}
                                </span>
                            )}

                            {previewAmenities.length === 0 && (
                                <span className="text-xs text-muted-foreground">
                                    Amenities will appear here once added.
                                </span>
                            )}
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
                        <Button type="submit" disabled={isLoading} className="w-full flex-1">
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
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

export default AccommodationPreviewCard;
