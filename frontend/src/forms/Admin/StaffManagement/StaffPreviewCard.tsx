import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { cn } from "@/lib/utils";
import { Building2, Mail, Phone, Save, ShieldCheck, UserRound, UtensilsCrossed, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

type StaffPreviewCardProps = {
    control: Control<{
        name: string;
        email: string;
        contactNo: string;
        role: "KITCHEN_STAFF" | "RESORT_STAFF" | "MAINTENANCE_STAFF";
        expertise?: "Electrical" | "Pool" | "Construction";
    }>;
    isLoading: boolean;
    oncancel: () => void;
};

const roleLabelMap = {
    KITCHEN_STAFF: "Kitchen Staff",
    MAINTENANCE_STAFF: "Maintenance Staff",
    RESORT_STAFF: "Resort Staff",
} as const;

const roleBadgeClassMap = {
    KITCHEN_STAFF: "border-amber-200 bg-amber-50 text-amber-700",
    MAINTENANCE_STAFF: "border-violet-200 bg-violet-50 text-violet-700",
    RESORT_STAFF: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

const expertiseLabelMap = {
    Construction: "Construction",
    Electrical: "Electrical",
    Pool: "Pool",
} as const;

const StaffPreviewCard = ({
    control,
    isLoading,
    oncancel,
}: StaffPreviewCardProps) => {
    const watchedName = useWatch({ control, name: "name" });
    const watchedEmail = useWatch({ control, name: "email" });
    const watchedContactNo = useWatch({ control, name: "contactNo" });
    const watchedRole = useWatch({ control, name: "role" }) || "KITCHEN_STAFF";
    const watchedExpertise = useWatch({ control, name: "expertise" });

    const previewName = watchedName?.trim() || "Staff member name";
    const previewEmail = watchedEmail?.trim() || "staff@johnmikos.com";
    const previewContactNo = watchedContactNo?.trim() || "No contact number yet";
    const previewRole = roleLabelMap[watchedRole];
    const previewExpertise =
        watchedRole === "MAINTENANCE_STAFF"
            ? watchedExpertise
                ? expertiseLabelMap[watchedExpertise]
                : "Expertise not selected"
            : "Not applicable";

    return (
        <div className="space-y-4 xl:sticky xl:top-6">
            <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
                <div className="border-b px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserRound className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-foreground">{previewName}</h3>
                            <p className="truncate text-sm text-muted-foreground">{previewEmail}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={cn("border shadow-none", roleBadgeClassMap[watchedRole])}>
                            {previewRole}
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            Pending Activation
                        </Badge>
                    </div>

                    <PreviewInfo
                    icon={<Mail className="h-4 w-4" />}
                    label="Email Address"
                    value={previewEmail}
                    />

                    <PreviewInfo
                    icon={<Phone className="h-4 w-4" />}
                    label="Contact Number"
                    value={previewContactNo}
                    />

                    <PreviewInfo
                    icon={watchedRole === "MAINTENANCE_STAFF" ? <Wrench className="h-4 w-4" /> : watchedRole === "RESORT_STAFF" ? <Building2 className="h-4 w-4" /> : <UtensilsCrossed className="h-4 w-4" />}
                    label="Expertise / Focus"
                    value={previewExpertise}
                    />

                    <div className="rounded-lg bg-muted/30 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                            Account Note
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            The new staff account will be available in staff management after creation, where you can later adjust role or activation status.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t pt-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            <span>{previewRole}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <UserRound className="h-4 w-4 text-muted-foreground" />
                            <span>Admin-created</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="py-0 shadow-none">
                <CardContent className="space-y-4 px-5 py-5">
                    <p className="text-sm text-muted-foreground">
                        <span className="text-red-700">*</span> Required fields
                    </p>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row xl:flex-col">
                        <Button type="button" variant="outline" disabled={isLoading} onClick={oncancel} className="w-full flex-1">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} type="submit" className="w-full flex-1">
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Create Staff
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const PreviewInfo = ({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) => {
    return (
        <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/5 p-2 text-primary">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                    {label}
                </p>
                <p className="truncate text-sm font-medium text-foreground">{value}</p>
            </div>
        </div>
    );
};

export default StaffPreviewCard;
