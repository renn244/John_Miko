import StaffReportFilter from "./StaffReportFilter";
import StaffReportSummaryCards from "./StaffReportSummaryCards";
import StaffReportTable from "./StaffReportTable";

const StaffReportsTab = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-bold">Staff Reports</h2>
                <p className="text-sm text-muted-foreground">
                    Review and manage reports submitted by resort staff before taking the next action.
                </p>
            </div>

            <StaffReportSummaryCards />
            <StaffReportFilter />
            <StaffReportTable />
        </div>
    )
}

export default StaffReportsTab
