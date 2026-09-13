import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { BookingReportDocumentation } from "@/features/shared/bookings/types/booking.type";
import { ChevronLeft, ChevronRight, CircleAlert, CircleCheckBig } from "lucide-react";
import { useMemo, useState } from "react";

type BookingReportViewDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    report: BookingReportDocumentation | null;
};

const BookingReportViewDialog = ({
    open,
    onOpenChange,
    report,
}: BookingReportViewDialogProps) => {
    if (!report) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <BookingReportViewDialogBody key={report.id} report={report} />
        </Dialog>
    );
};

const BookingReportViewDialogBody = ({
    report,
}: {
    report: BookingReportDocumentation;
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedImage = useMemo(() => {
        if (!report.proofImages.length) return null;
        return report.proofImages[Math.min(selectedIndex, report.proofImages.length - 1)];
    }, [report, selectedIndex]);

    const hasImages = report.proofImages.length > 0;

    return (
        <DialogContent
            showCloseButton
            className="max-h-[90vh] overflow-y-auto border bg-white p-0 shadow-lg sm:max-w-xl"
        >
            <div>
                <DialogHeader className="border-b px-4 py-4 text-left">
                    <div className="mb-2 flex flex-wrap gap-2">
                        <ReportTypeBadge type={report.type} />
                        <ReportStatusBadge status={report.status} />
                        <ReportSeverityBadge severity={report.severity} />
                    </div>

                    <DialogTitle className="pr-8 text-lg leading-snug font-bold sm:text-xl">
                        {report.title}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm">
                        {report.id} · {new Date(report.createdAt).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 px-4 py-4">
                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Description
                        </p>
                        <p className="text-sm leading-7 text-foreground/90">
                            {report.description}
                        </p>
                    </section>

                    <section className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {(report.user.name || report.user.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Reported by</p>
                                <p className="text-sm font-semibold">
                                    {report.user.name || report.user.email}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Proof Photos
                        </p>

                        {hasImages && selectedImage ? (
                            <div className="space-y-2">
                                <div className="relative overflow-hidden rounded-2xl bg-muted">
                                    <ViewPhotoDialog imageUrl={selectedImage}>
                                        <button type="button" className="block w-full">
                                            <img
                                                src={selectedImage}
                                                alt="Selected proof"
                                                className="h-56 w-full object-cover sm:h-64"
                                            />
                                        </button>
                                    </ViewPhotoDialog>

                                    {report.proofImages.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedIndex((prev) =>
                                                        prev === 0 ? report.proofImages.length - 1 : prev - 1,
                                                    )
                                                }
                                                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-1.5 text-white transition hover:bg-black/50"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedIndex((prev) =>
                                                        prev === report.proofImages.length - 1 ? 0 : prev + 1,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-1.5 text-white transition hover:bg-black/50"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}

                                    <div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2 py-0.5 text-xs font-semibold text-white">
                                        {selectedIndex + 1}/{report.proofImages.length}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {report.proofImages.map((image, index) => (
                                        <button
                                            key={`${report.id}-${index}`}
                                            type="button"
                                            onClick={() => setSelectedIndex(index)}
                                            className={`overflow-hidden rounded-xl border-2 transition ${
                                                index === selectedIndex
                                                    ? "border-primary shadow-sm"
                                                    : "border-transparent hover:border-primary/40"
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Proof thumbnail ${index + 1}`}
                                                className="h-12 w-12 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed bg-muted/25 px-4 py-5 text-sm text-muted-foreground">
                                No proof photos were attached to this report.
                            </div>
                        )}
                    </section>

                    {report.rejectionNote ? (
                        <section className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-red-700">
                                <CircleAlert className="h-4 w-4" />
                                <p className="text-xs font-semibold uppercase tracking-wide">
                                    Rejection Note
                                </p>
                            </div>
                            <p className="text-sm leading-6 text-red-700">
                                {report.rejectionNote}
                            </p>
                        </section>
                    ) : null}
                </div>
            </div>
        </DialogContent>
    );
};

const ReportTypeBadge = ({ type }: { type: BookingReportDocumentation["type"] }) => {
    if (type === "checkOut") {
        return (
            <Badge className="border-violet-200 bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                Check-Out
            </Badge>
        );
    }

    return (
        <Badge className="border-blue-200 bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
            Check-In
        </Badge>
    );
};

const ReportStatusBadge = ({ status }: { status: BookingReportDocumentation["status"] }) => {
    if (status === "Approved") {
        return (
            <Badge className="border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                <CircleCheckBig className="h-3.5 w-3.5" />
                Approved
            </Badge>
        );
    }

    if (status === "Rejected") {
        return (
            <Badge className="border-red-200 bg-red-100 px-2 py-0.5 text-xs text-red-700">
                Rejected
            </Badge>
        );
    }

    return (
        <Badge className="border-amber-200 bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
            Pending
        </Badge>
    );
};

const ReportSeverityBadge = ({
    severity,
}: {
    severity: BookingReportDocumentation["severity"];
}) => {
    if (severity === "High") {
        return (
            <Badge className="border-red-200 bg-red-100 px-2 py-0.5 text-xs text-red-700">
                High
            </Badge>
        );
    }

    if (severity === "Medium") {
        return (
            <Badge className="border-amber-200 bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                Medium
            </Badge>
        );
    }

    return (
        <Badge className="border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            Low
        </Badge>
    );
};

export default BookingReportViewDialog;
