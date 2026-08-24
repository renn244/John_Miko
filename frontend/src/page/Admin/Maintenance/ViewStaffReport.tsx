import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import StaffReportReviewCard from "@/components/pageComponents/Admin/Maintenance/StaffReportReviewCard";
import {
    formatStaffReportType,
    getStaffReportSeverityClasses,
    getStaffReportStatusClasses,
    getStaffReportTypeClasses,
} from "@/components/pageComponents/Admin/Maintenance/staffReportDisplay";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetBookingById } from "@/hooks/admin/booking.hook";
import { useGetStaffReportByIdQuery } from "@/hooks/admin/staff-report.hook";
import getCheckInOut from "@/lib/getCheckInOut";
import { format } from "date-fns";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

const ViewStaffReport = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error, refetch, isRefetching } = useGetStaffReportByIdQuery(id);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner className="size-10" />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorDialog
                onBack={() => navigate(-1)}
                onRetry={refetch}
                retryLoading={isRefetching}
            />
        );
    }

    if (!data) {
        return (
            <NotFoundDialog
                title="Staff Report Not Found"
                onBack={() => navigate(-1)}
                onRetry={refetch}
                retryLoading={isRefetching}
            />
        );
    }

    return <ViewStaffReportContent reportId={id!} />;
};

const ViewStaffReportContent = ({ reportId }: { reportId: string }) => {
    const { data: report } = useGetStaffReportByIdQuery(reportId);
    const { data: booking } = useGetBookingById(report?.bookingId ?? undefined);

    const reservationSchedule = useMemo(() => {
        if (!booking) return null;

        return getCheckInOut({
            bookingDate: booking.bookingDate,
            startTime: booking.stayOption?.startTime,
            endTime: booking.stayOption?.endTime,
            label: booking.stayOption?.label ?? booking.stayOptionLabelSnapshot,
        });
    }, [booking]);

    if (!report) return null;

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <AdminPageHeader
                backTo="/admin/maintenance?tab=staff-reports"
                backLabel="Back to staff reports"
                title="Staff Report Details"
                description={`${report.title} · ${report.id} · Submitted ${format(new Date(report.createdAt), "MMM dd, yyyy, h:mm a")}`}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getStaffReportTypeClasses(report.type)}>
                            {formatStaffReportType(report.type)}
                        </Badge>
                        <Badge className={getStaffReportSeverityClasses(report.severity)}>
                            {report.severity}
                        </Badge>
                        <Badge className={getStaffReportStatusClasses(report.status)}>
                            {report.status}
                        </Badge>
                    </div>
                }
            />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-6">
                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Report Description</h2>
                        </div>
                        <p className="leading-7 text-foreground/90">{report.description}</p>
                    </Card>

                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Proof Photos</h2>
                            <Badge variant="outline">{report.proofImages.length}</Badge>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {report.proofImages.map((imageUrl, index) => (
                                <ViewPhotoDialog key={imageUrl} imageUrl={imageUrl}>
                                    <button
                                        type="button"
                                        className="group relative overflow-hidden rounded-xl border bg-muted text-left"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Proof photo ${index + 1}`}
                                            className="h-52 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                        />
                                        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                                            {index + 1}
                                        </div>
                                    </button>
                                </ViewPhotoDialog>
                            ))}
                        </div>
                    </Card>

                    {booking && reservationSchedule && (
                        <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold text-foreground md:text-lg">Linked Booking</h2>
                            </div>

                            <div className="rounded-xl border bg-primary/5 p-5">
                                <div className="mb-4">
                                    <p className="font-semibold text-primary">{booking.referenceCode ?? "—"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.guestName}
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Check-In
                                        </p>
                                        <p className="font-semibold">{reservationSchedule.checkIn}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {reservationSchedule.checkInDayOfTheWeek}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Check-Out
                                        </p>
                                        <p className="font-semibold">{reservationSchedule.checkOut}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {reservationSchedule.checkOutDayOfTheWeek}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Accommodation
                                        </p>
                                        <p className="font-semibold">{booking.accommodation.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.accommodation.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Guests
                                        </p>
                                        <p className="font-semibold">{booking.numberOfGuests} pax</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Reporter</h2>
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold">{report.user.name || report.user.email}</p>
                            <p className="text-sm text-muted-foreground">{report.user.role}</p>
                            <p className="text-sm text-muted-foreground">{report.user.email}</p>
                            <p className="text-sm text-muted-foreground">{report.user.contactNo}</p>
                        </div>
                    </Card>

                    <Card className="gap-0 rounded-xl border bg-card p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-foreground md:text-lg">Details</h2>
                        </div>

                        <div className="space-y-4 text-sm">
                            <DetailRow label="Report ID" value={report.id} />
                            <DetailRow
                                label="Type"
                                value={formatStaffReportType(report.type)}
                            />
                            <DetailRow label="Severity" value={report.severity} />
                            <DetailRow label="Status" value={report.status} />
                            <DetailRow
                                label="Submitted"
                                value={format(
                                    new Date(report.createdAt),
                                    "MMM dd, yyyy, h:mm a",
                                )}
                            />
                            {report.reviewedAt && (
                                <DetailRow
                                    label="Reviewed At"
                                    value={format(
                                        new Date(report.reviewedAt),
                                        "MMM dd, yyyy, h:mm a",
                                    )}
                                />
                            )}
                            {report.reviewedById && (
                                <DetailRow
                                    label="Reviewed By"
                                    value={
                                        report.reviewedBy?.name ||
                                        report.reviewedBy?.email ||
                                        report.reviewedById
                                    }
                                />
                            )}
                        </div>
                    </Card>

                    <StaffReportReviewCard report={report} />
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
};

export default ViewStaffReport;
