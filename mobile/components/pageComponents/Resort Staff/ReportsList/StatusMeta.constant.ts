import { StatusChipTone } from "@/components/ui/status-chip";
import { ReportStatus } from "@/types/staffReport.type";

const statusMeta: Record<
    ReportStatus,
    {
        sectionTitle: string;
        accentClassName: string;
        dotClassName: string;
        tone: StatusChipTone;
    }
> = {
    Pending: {
        sectionTitle: "Pending action",
        accentClassName: "bg-secondary-yellow-light",
        dotClassName: "bg-secondary-yellow-light",
        tone: "pending",
    },
    Approved: {
        sectionTitle: "Approved",
        accentClassName: "bg-secondary-green-light",
        dotClassName: "bg-secondary-green-light",
        tone: "approved",
    },
    Rejected: {
        sectionTitle: "Rejected",
        accentClassName: "bg-system-red",
        dotClassName: "bg-system-red",
        tone: "rejected",
    },
};

export default statusMeta;