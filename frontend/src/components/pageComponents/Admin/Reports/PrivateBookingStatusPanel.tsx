import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetResortClosureByDate } from "@/hooks/admin/closure.hook";
import { toDateOnly } from "@/lib/date.util";
import type { Closure } from "@/types/admin/closure.type";
import { format } from "date-fns";
import { AlertCircle, CircleCheckBig, Lock, RefreshCcw } from "lucide-react";
import { useMemo } from "react";

type ResortStatusViewModel = {
    badgeLabel: string;
    badgeClassName: string;
    title: string;
    description: string;
    detailType: string;
    detailReason: string;
    dataAvailability: string;
    dataAvailabilityHint: string;
    icon: typeof CircleCheckBig;
    iconClassName: string;
    iconWrapperClassName: string;
};

const getResortStatusViewModel = (closure: Closure | null): ResortStatusViewModel => {
    if (!closure) {
        return {
            badgeLabel: "Open",
            badgeClassName: "bg-emerald-100 text-emerald-700 border-emerald-200",
            title: "Open for Regular Booking",
            description: "No resort-wide closure is scheduled for this date.",
            detailType: "Regular Operations",
            detailReason: "No closure reason needed",
            dataAvailability: "Booking data available",
            dataAvailabilityHint: "Normal report cards and booking-related metrics can be shown.",
            icon: CircleCheckBig,
            iconClassName: "text-emerald-600",
            iconWrapperClassName: "bg-emerald-100",
        };
    }

    if (closure.type === "Private") {
        return {
            badgeLabel: "Private Booking",
            badgeClassName: "bg-violet-100 text-violet-700 border-violet-200",
            title: "Private Booking",
            description: "The whole resort is reserved privately for the selected date. No guest booking record is available for reporting.",
            detailType: "Private",
            detailReason: closure.reason?.trim() || "No public reason provided",
            dataAvailability: "No booking data available",
            dataAvailabilityHint: "Private closures do not create guest booking records or booking detail data.",
            icon: Lock,
            iconClassName: "text-violet-600",
            iconWrapperClassName: "bg-violet-100",
        };
    }

    return {
        badgeLabel: "Resort Closed",
        badgeClassName: "bg-amber-100 text-amber-700 border-amber-200",
        title: "Resort Closed",
        description: "The whole resort is unavailable for regular guest bookings on this date.",
        detailType: closure.type || "Close",
        detailReason: closure.reason?.trim() || "No reason provided",
        dataAvailability: "No regular booking data available",
        dataAvailabilityHint: "Closure dates do not have normal guest booking detail records to display.",
        icon: AlertCircle,
        iconClassName: "text-amber-600",
        iconWrapperClassName: "bg-amber-100",
    };
};

const PrivateBookingStatusPanel = ({ selectedDate }: { selectedDate: Date }) => {
    const selectedDateValue = toDateOnly(selectedDate);

    const { data: closure, isLoading, isFetching, error, refetch } = useGetResortClosureByDate(selectedDateValue);

    const status = useMemo(() => getResortStatusViewModel(closure ?? null), [closure]);
    const StatusIcon = status.icon;

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">
                        Daily Resort Status
                    </h3>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Availability summary for the selected date.
                    </p>
                </div>
            </div>

            {isLoading || isFetching ? (
                <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-destructive/10 p-2">
                            <AlertCircle className="w-4 h-4 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-foreground">
                                Unable to load resort status
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Something went wrong while checking the selected date.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCcw className="w-4 h-4" />
                            Retry
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${status.iconWrapperClassName}`}>
                                    <StatusIcon className={`h-5 w-5 ${status.iconClassName}`} />
                                </div>

                                <div className="space-y-2">
                                    <Badge variant="outline" className={`px-2 py-0.5 text-[11px] font-semibold ${status.badgeClassName}`}>
                                        {status.badgeLabel}
                                    </Badge>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground">
                                            {status.title}
                                        </h4>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {status.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-background px-4 py-3">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Date
                                </div>
                                <div className="mt-1 text-sm font-semibold text-foreground">
                                    {format(selectedDate, "PPPP")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <DetailCard
                            label="Status"
                            value={status.title}
                            hint={closure ? "Resort-wide closure found" : "No resort-wide closure found"}
                        />
                        <DetailCard
                            label="Type"
                            value={status.detailType}
                            hint={closure ? "Based on the saved closure record" : "Normal public operations"}
                        />
                        {closure && (
                            <DetailCard
                                label="Data"
                                value={status.dataAvailability}
                                hint={status.dataAvailabilityHint}
                            />
                        )}
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                        <div className="text-xs font-medium text-muted-foreground">
                            Details
                        </div>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                            {status.detailReason}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailCard = ({ label, value, hint }: { label: string; value: string; hint: string }) => {
    return (
        <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-xs font-medium text-muted-foreground">
                {label}
            </div>
            <div className="mt-2 text-base font-semibold text-foreground">
                {value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
                {hint}
            </div>
        </div>
    );
};

export default PrivateBookingStatusPanel;
