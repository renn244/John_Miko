import StatisticCards from "@/components/ui/StatisticCards";
import { useGetStaffActivityReportQuery } from "@/features/admin/reports/hooks/useAdminReports";
import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

const reportSummaryCards = [
    {
        key: "total",
        title: "Total Reports",
        Icon: <FileText />,
        accentClassName: "border-l-blue-500",
        iconContainerClassName: "bg-blue-500",
    },
    {
        key: "pending",
        title: "Pending",
        Icon: <Clock3 />,
        accentClassName: "border-l-amber-500",
        iconContainerClassName: "bg-amber-500",
    },
    {
        key: "approved",
        title: "Approved",
        Icon: <CheckCircle2 />,
        accentClassName: "border-l-emerald-500",
        iconContainerClassName: "bg-emerald-500",
    },
    {
        key: "rejected",
        title: "Rejected",
        Icon: <XCircle />,
        accentClassName: "border-l-rose-500",
        iconContainerClassName: "bg-rose-500",
    },
] as const;

const StaffReportSummaryCards = () => {
    const { data, isLoading } = useGetStaffActivityReportQuery();

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {reportSummaryCards.map(({ key, title, Icon, accentClassName, iconContainerClassName }) => (
                <StatisticCards
                    key={key}
                    title={title}
                    Icon={Icon}
                    accentClassName={accentClassName}
                    iconContainerClassName={iconContainerClassName}
                    stat={data?.[key] ?? 0}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};

export default StaffReportSummaryCards;
