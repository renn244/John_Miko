import { reportApi } from "@/features/admin/reports/api/adminReport.api";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { toDateOnly } from "@/lib/date.util";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ReportExportMenu = ({ selectedDate }: { selectedDate: Date }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const { blob, fileName } = await reportApi.exportReport(toDateOnly(selectedDate));
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success("CSV report downloaded");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to export the report");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            className="w-full sm:w-auto"
            disabled={isExporting}
            onClick={() => void handleExport()}
        >
            {isExporting ? <LoadingSpinner className="size-4" /> : <Download />}
            {isExporting ? "Preparing export..." : "Export CSV"}
        </Button>
    );
};

export default ReportExportMenu;
