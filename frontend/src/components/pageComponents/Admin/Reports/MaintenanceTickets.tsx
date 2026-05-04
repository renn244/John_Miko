import { useGetMaintenanceReportQuery } from "@/hooks/admin/maintenance.hook";
import { useGetStaffReportReportsQuery } from "@/hooks/admin/staff-report.hook";

const MaintenanceTickets = () => {
    const { data: maintenance, isLoading: maintenanceLoading } = useGetMaintenanceReportQuery();
    const { data: report, isLoading: staffLoading } = useGetStaffReportReportsQuery()

    if(maintenanceLoading || staffLoading) return

    if(!maintenance || !report) return

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-5 text-foreground">
                Maintenance Tickets
            </h3>

            <div className="space-y-3">

                <TicketItem
                label="New today"
                value={maintenance.newToday}
                />

                <TicketItem
                label="Resolved"
                value={maintenance.resolvedToday}
                valueColor="text-emerald-600"
                />

                <TicketItem
                label="Still pending"
                value={maintenance.stillPending}
                valueColor="text-amber-600"
                />

                <TicketItem
                label="High Priority"
                value={maintenance.highPriority}
                valueColor="text-red-600"
                />

                <div className="grid grid-cols-2 gap-3">
                    <MiniTicket
                    label="From Check-in"
                    value={report.checkInReportToday}
                    />
                    <MiniTicket
                    label="From Check-out"
                    value={report.checkOutReportToday}
                    />
                </div>

                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Staff reports
                        </span>
                        <span className="text-sm font-bold text-foreground">
                            {report.totalToday} {report.totalToday > 1 ? "reports" : "report"}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
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
    )
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
    )
}

export default MaintenanceTickets