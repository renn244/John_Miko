import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGetResortClosureByDate } from "@/hooks/admin/closure.hook"
import { toDateOnly } from "@/lib/date.util"
import AccommodationBreakdown from "@/components/pageComponents/Admin/Reports/AccommodationBreakdown"
import GuestFeedback from "@/components/pageComponents/Admin/Reports/GuestFeedback"
import MaintenanceTickets from "@/components/pageComponents/Admin/Reports/MaintenanceTickets"
import RevenueBreakdown from "@/components/pageComponents/Admin/Reports/RevenueBreakdown"
import PrivateBookingStatusPanel from "@/components/pageComponents/Admin/Reports/PrivateBookingStatusPanel"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

const Report = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const today = new Date();
    const selectedDateValue = toDateOnly(selectedDate);
    const { data: resortClosure } = useGetResortClosureByDate(selectedDateValue);
    const showStatusOnly = Boolean(resortClosure);

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Reports
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Daily resort status and operational insights
                    </p>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal md:w-64"
                        >
                            <CalendarIcon className="w-4 h-4" />
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
            </div>

           {/* <Statistics /> */}

            {showStatusOnly ? (
                <div className="grid grid-cols-1 gap-6">
                    <PrivateBookingStatusPanel selectedDate={selectedDate} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PrivateBookingStatusPanel selectedDate={selectedDate} />

                    <RevenueBreakdown selectedDate={selectedDate} />

                    <AccommodationBreakdown selectedDate={selectedDate} />

                    <MaintenanceTickets selectedDate={selectedDate} />

                    <GuestFeedback selectedDate={selectedDate} />                
                </div>
            )}

        </div>
    )
}

export default Report
