import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { cn } from "@/lib/utils";
import { EllipsisVertical, QrCode, Save } from "lucide-react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

type PaymentMethodPreviewCardProps = {
    control: Control<{
        name: string;
        type: "GCASH" | "MAYA" | "BANK" | "CASH";
        accountName?: string;
        accountNumber?: string;
        instructions?: string;
        qrCodeUrl?: string | null;
        sortOrder?: number;
        isActive?: boolean;
    }>;
    buttonText: string;
    isLoading: boolean;
    oncancel: () => void;
};

const paymentTypeLabel = {
    BANK: "Bank Transfer",
    CASH: "Cash on-site",
    GCASH: "GCash",
    MAYA: "Maya",
} as const;

const PaymentMethodPreviewCard = ({
    control,
    buttonText,
    isLoading,
    oncancel,
}: PaymentMethodPreviewCardProps) => {
    const watchedName = useWatch({ control, name: "name" });
    const watchedType = useWatch({ control, name: "type" });
    const watchedAccountName = useWatch({ control, name: "accountName" });
    const watchedAccountNumber = useWatch({ control, name: "accountNumber" });
    const watchedInstructions = useWatch({ control, name: "instructions" });
    const watchedQrCodeUrl = useWatch({ control, name: "qrCodeUrl" });
    const watchedIsActive = useWatch({ control, name: "isActive" });

    const previewName = watchedName?.trim() || "Payment method name";
    const previewType = paymentTypeLabel[watchedType || "GCASH"];
    const previewAccountName = watchedAccountName?.trim() || "No account name yet";
    const previewAccountNumber = watchedAccountNumber?.trim() || "No account number yet";
    const previewInstructions =
        watchedInstructions?.trim() || "Guest payment instructions will appear here after you fill out the form.";
    const previewIsActive = watchedIsActive ?? true;

    return (
        <div className="space-y-4 xl:sticky xl:top-6">
            <Card className="gap-0 border-border/70 py-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 truncate text-base font-semibold text-foreground">
                            {previewName}
                        </h3>

                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled
                        className="h-8 w-8 shrink-0 rounded-full text-muted-foreground"
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                        {watchedQrCodeUrl ? (
                            <img
                            src={watchedQrCodeUrl}
                            alt={`${previewName} QR code`}
                            className="h-16 w-16 shrink-0 object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-muted-foreground">
                                <QrCode className="h-5 w-5" />
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-lg font-medium text-foreground">
                                {previewAccountName}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                                {previewAccountNumber}
                            </p>
                        </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {previewInstructions}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5">
                                <QrCode className="h-3.5 w-3.5" />
                                {watchedQrCodeUrl ? "QR ready" : "No QR"}
                            </span>

                            <span>
                                {previewIsActive ? "Visible to guests" : "Hidden from checkout"}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Badge>
                                {previewType}
                            </Badge>
                            <Badge
                            className={cn(
                                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-none",
                                previewIsActive
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 bg-slate-100 text-slate-600",
                            )}
                            >
                                {previewIsActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
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

export default PaymentMethodPreviewCard;
