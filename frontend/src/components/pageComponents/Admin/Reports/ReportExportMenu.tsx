import { reportApi } from "@/api/admin/report.api";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toDateOnly } from "@/lib/date.util";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ExportFormat = "csv" | "xlsx";

const exportDetails: Record<ExportFormat, { label: string; description: string; icon: typeof FileText }> = {
    csv: {
        label: "CSV data",
        description: "One clean data table for importing, sorting, and analysis.",
        icon: FileText,
    },
    xlsx: {
        label: "Excel workbook",
        description: "Friendly summary, visual charts, and the complete report-data table.",
        icon: FileSpreadsheet,
    },
};

const ReportExportMenu = ({ selectedDate }: { selectedDate: Date }) => {
    const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

    const handleExport = async (format: ExportFormat) => {
        setExportingFormat(format);

        try {
            const { blob, fileName } = await reportApi.exportReport(toDateOnly(selectedDate), format);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success(`${exportDetails[format].label} downloaded`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to export the report");
        } finally {
            setExportingFormat(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto" disabled={Boolean(exportingFormat)}>
                    {exportingFormat ? <LoadingSpinner className="size-4" /> : <Download />}
                    {exportingFormat ? "Preparing export..." : "Export report"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Choose an export format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(exportDetails) as ExportFormat[]).map((format) => {
                    const detail = exportDetails[format];
                    const Icon = detail.icon;

                    return (
                        <DropdownMenuItem
                            key={format}
                            className="items-start gap-3 px-3 py-3"
                            disabled={Boolean(exportingFormat)}
                            onSelect={(event) => {
                                event.preventDefault();
                                void handleExport(format);
                            }}
                        >
                            <Icon className="mt-0.5 size-4 text-primary" />
                            <span className="grid gap-0.5">
                                <span className="font-medium text-foreground">{detail.label}</span>
                                <span className="text-xs leading-5 text-muted-foreground">
                                    {detail.description}
                                </span>
                            </span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ReportExportMenu;
