import AccommodationBreakdown from "@/features/admin/reports/components/AccommodationBreakdown";
import DailyMetrics from "@/features/admin/reports/components/DailyMetrics";
import GuestFeedback from "@/features/admin/reports/components/GuestFeedback";
import MaintenanceTickets from "@/features/admin/reports/components/MaintenanceTickets";
import PrivateBookingStatusPanel from "@/features/admin/reports/components/PrivateBookingStatusPanel";
import ReportExportMenu from "@/features/admin/reports/components/ReportExportMenu";
import RevenueBreakdown from "@/features/admin/reports/components/RevenueBreakdown";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetResortClosureByDate } from "@/features/shared/closures/hooks/useClosureAvailability";
import { toDateOnly } from "@/lib/date.util";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const Report = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const today = new Date();
    const selectedDateValue = toDateOnly(selectedDate);
    const { data: resortClosure } = useGetResortClosureByDate(selectedDateValue);
    const showStatusOnly = Boolean(resortClosure);

    return (
        <div className="space-y-5">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        Reports
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Date-based resort reporting and performance breakdowns.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal sm:w-auto md:min-w-64"
                            >
                                <CalendarIcon className="size-4" />
                                {format(selectedDate, "PPP")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                disabled={{ after: today }}
                                onSelect={(date) => {
                                    if (date) {
                                        setSelectedDate(date);
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <ReportExportMenu selectedDate={selectedDate} />
                </div>
            </header>

            {showStatusOnly ? (
                <div className="grid grid-cols-1 gap-5">
                    <PrivateBookingStatusPanel selectedDate={selectedDate} />
                </div>
            ) : (
                <>
                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                        <DailyMetrics selectedDate={selectedDate} />
                        <RevenueBreakdown selectedDate={selectedDate} />
                    </section>

                    <section className="grid gap-5 xl:grid-cols-3">
                        <AccommodationBreakdown selectedDate={selectedDate} />
                        <MaintenanceTickets selectedDate={selectedDate} />
                        <GuestFeedback selectedDate={selectedDate} />
                    </section>
                </>
            )}
        </div>
    );
};

export default Report;
