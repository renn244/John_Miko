import { useGetMaintenanceReportQuery } from "@/hooks/admin/maintenance.hook";
import { useGetStaffReportReportsQuery } from "@/hooks/admin/staff-report.hook";
import { toDateOnly } from "@/lib/date.util";

const MaintenanceTickets = ({ selectedDate }: { selectedDate: Date }) => {
    const selectedDateValue = toDateOnly(selectedDate);
    const { data: maintenance, isLoading: maintenanceLoading } = useGetMaintenanceReportQuery(selectedDateValue);
    const { data: report, isLoading: staffLoading } = useGetStaffReportReportsQuery(selectedDateValue);

    if(maintenanceLoading || staffLoading) return;

    if(!maintenance || !report) return;

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-5 text-foreground">
                Maintenance Tickets
            </h3>

            <div className="space-y-3">
                <TicketItem
                    label="Tickets created today"
                    value={maintenance.newTickets}
                />

                <TicketItem
                    label="Tickets resolved today"
                    value={maintenance.resolvedTickets}
                    valueColor="text-emerald-600"
                />

                <div className="grid grid-cols-3 gap-3">
                    <MiniTicket
                        label="Check-in reports today"
                        value={report.checkInReportToday}
                    />
                    <MiniTicket
                        label="Check-out reports today"
                        value={report.checkOutReportToday}
                    />
                    <MiniTicket
                        label="Maintenance reports today"
                        value={report.maintenanceReportToday}
                    />
                </div>

                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Reports submitted today
                        </span>
                        <span className="text-sm font-bold text-foreground">
                            {report.totalToday} {report.totalToday > 1 ? "reports" : "report"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

type TicketItemProps = {
    label: string
    value: number
    valueColor?: string
}

const TicketItem = ({ label, value, valueColor }: TicketItemProps) => {
    return (
        <div className="p-4 rounded-lg border border-border bg-muted/40">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                    {label}
                </span>
                <span className={`text-lg font-bold ${valueColor || "text-foreground"}`}>
                    {value}
                </span>
            </div>
        </div>
    );
}

type MiniTicketProps = {
    label: string
    value: string | number
    valueColor?: string
}

const MiniTicket = ({ label, value, valueColor }: MiniTicketProps) => {
    return (
        <div className="p-3 rounded-lg border border-border bg-muted/40">
            <div className="text-xs mb-1 text-muted-foreground">
                {label}
            </div>
            <div className={`text-sm font-bold ${valueColor || "text-foreground"}`}>
                {value}
            </div>
        </div>
    );
}

export default MaintenanceTickets;
