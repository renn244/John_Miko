import StaffReportSummaryCards from "./StaffReportSummaryCards";
import StaffReportTable from "./StaffReportTable";

const StaffReportsTab = () => {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6">
            <StaffReportSummaryCards />
            <StaffReportTable />
        </div>
    )
}

export default StaffReportsTab
