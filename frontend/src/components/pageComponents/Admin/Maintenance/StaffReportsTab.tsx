import StaffReportFilter from "./StaffReportFilter";
import StaffReportSummaryCards from "./StaffReportSummaryCards";
import StaffReportTable from "./StaffReportTable";

const StaffReportsTab = () => {
    return (
        <div className="space-y-6">
            <StaffReportSummaryCards />
            <StaffReportFilter />
            <StaffReportTable />
        </div>
    )
}

export default StaffReportsTab
