import StatisticCards from "@/components/ui/StatisticCards";
import { useGetStaffReportReportsQuery } from "@/hooks/admin/staff-report.hook";
import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

const reportSummaryCards = [
    {
        key: "total",
        title: "Total Reports",
        Icon: <FileText className="w-5 h-5 text-primary" />,
    },
    {
        key: "pending",
        title: "Pending",
        Icon: <Clock3 className="w-5 h-5 text-amber-500" />,
    },
    {
        key: "approved",
        title: "Approved",
        Icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
    },
    {
        key: "rejected",
        title: "Rejected",
        Icon: <XCircle className="w-5 h-5 text-red-700" />,
    },
] as const;

const StaffReportSummaryCards = () => {
    const { data, isLoading } = useGetStaffReportReportsQuery();

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {reportSummaryCards.map(({ key, title, Icon }) => (
                <StatisticCards
                    key={key}
                    title={title}
                    Icon={Icon}
                    stat={data?.[key] ?? 0}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};

export default StaffReportSummaryCards;
