import apiClient from "@/lib/apiClient";
import type { AccommodationReport } from "@/features/shared/accommodations/types/accommodation.type";
import type { MaintenanceReport } from "@/features/admin/maintenance/types/maintenance.type";
import type { PaymentReportBreakdown } from "@/features/admin/payments/types/payment.type";
import type { DailyMetricsReport } from "@/features/admin/reports/types/report.type";
import type { StaffReportSummary } from "@/features/admin/staff-reports/types/staff-report.type";
import type { FeedbackReport } from "@/features/shared/feedback/types/feedback.type";

const getReport = async <T>(path: string, date?: string) => {
    const response = await apiClient.get(path, { params: { date } });

    if (response.status >= 400) {
        throw new Error(response.data.message || "Failed to fetch report data");
    }

    return response.data as T;
};

export const reportApi = {
    getDailyMetrics: async (date?: string) => {
        return getReport<DailyMetricsReport>("/reports/daily-metrics", date);
    },
    getRevenue: (date?: string) => getReport<PaymentReportBreakdown>("/reports/revenue", date),
    getAccommodation: (date?: string) => getReport<AccommodationReport>("/reports/accommodation", date),
    getMaintenance: (date?: string) => getReport<MaintenanceReport>("/reports/maintenance", date),
    getFeedback: (date?: string) => getReport<FeedbackReport>("/reports/feedback", date),
    getStaffActivity: (date?: string) => getReport<StaffReportSummary>("/reports/staff-activity", date),
    exportReport: async (date: string, format: "csv" | "xlsx") => {
        const response = await apiClient.get("/reports/export", {
            params: { date, format },
            responseType: "blob",
        });

        if (response.status >= 400) {
            const message = await response.data.text();
            try {
                const parsed = JSON.parse(message) as { message?: string };
                throw new Error(parsed.message || "Failed to export report");
            } catch (error) {
                if (error instanceof Error && error.message !== message) {
                    throw error;
                }
                throw new Error("Failed to export report");
            }
        }

        const contentDisposition = String(response.headers["content-disposition"] || "");
        const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
        const fallbackName = `john-mikos-place-report-${date.slice(0, 10)}.${format}`;

        return {
            blob: response.data as Blob,
            fileName: fileNameMatch?.[1] || fallbackName,
        };
    },
};
