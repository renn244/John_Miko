import MaintenanceTicketCard from "@/features/admin/maintenance/components/MaintenanceTicketCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import type { Maintenance } from "@/features/admin/maintenance/types/maintenance.type";
import { Save } from "lucide-react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

type MaintenancePreviewCardProps = {
    control: Control<{
        title: string;
        description: string;
        imagesUrl: string[];
        priority: "Low" | "Medium" | "High";
        expertise: "Electrical" | "Pool" | "Construction";
    }>;
    buttonText: string;
    isLoading: boolean;
    oncancel: () => void;
    initialData?: Maintenance;
};

const MaintenancePreviewCard = ({
    control,
    buttonText,
    isLoading,
    oncancel,
    initialData,
}: MaintenancePreviewCardProps) => {
    const watchedTitle = useWatch({ control, name: "title" });
    const watchedDescription = useWatch({ control, name: "description" });
    const watchedImagesUrl = useWatch({ control, name: "imagesUrl" });
    const watchedPriority = useWatch({ control, name: "priority" });
    const watchedExpertise = useWatch({ control, name: "expertise" });

    const previewTicket: Maintenance = {
        id: initialData?.id || "draft",
        title: watchedTitle?.trim() || "Maintenance issue title",
        description:
            watchedDescription?.trim() ||
            "A short summary of the issue will appear here while you fill out the form.",
        imagesUrl: watchedImagesUrl || [],
        priority: watchedPriority || "Low",
        status: initialData?.status || "Pending",
        expertise: watchedExpertise || "Electrical",
        assignedToId: initialData?.assignedToId ?? null,
        assignedTo: initialData?.assignedTo ?? null,
        notes: initialData?.notes,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: initialData?.updatedAt || new Date().toISOString(),
        startedAt: initialData?.startedAt,
        resolvedAt: initialData?.resolvedAt,
        closedAt: initialData?.closedAt,
        resolutionNotes: initialData?.resolutionNotes,
        resolutionProofImages: initialData?.resolutionProofImages,
    };

    return (
        <div className="space-y-4 xl:sticky xl:top-6">
            <MaintenanceTicketCard
            ticket={previewTicket}
            idLabel={initialData?.id ? `ID: ${initialData.id}` : "Draft ticket"}
            footerLabel="Ticket State"
            footerValue={initialData ? "Existing maintenance ticket" : "New maintenance ticket"}
            />

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

export default MaintenancePreviewCard;
