import { reportApi } from "@/api/admin/report.api";
import { useQuery } from "@tanstack/react-query";

export const useGetDailyMetricsQuery = (date?: string) => {
    return useQuery({
        queryKey: ["reports", "daily-metrics", date],
        queryFn: () => reportApi.getDailyMetrics(date),
        refetchOnWindowFocus: false,
    });
};

export const useGetRevenueReportQuery = (date?: string) => {
    return useQuery({
        queryKey: ["reports", "revenue", date],
        queryFn: () => reportApi.getRevenue(date),
        refetchOnWindowFocus: false,
    });
};

export const useGetAccommodationReportQuery = (date?: string) => {
    return useQuery({
        queryKey: ["reports", "accommodation", date],
        queryFn: () => reportApi.getAccommodation(date),
        refetchOnWindowFocus: false,
    });
};

export const useGetMaintenanceReportQuery = (date?: string) => {
    return useQuery({
        queryKey: ["reports", "maintenance", date],
        queryFn: () => reportApi.getMaintenance(date),
        refetchOnWindowFocus: false,
    });
};

export const useGetFeedbackReportQuery = (date?: string) => {
    return useQuery({
        queryKey: ["reports", "feedback", date],
        queryFn: () => reportApi.getFeedback(date),
        refetchOnWindowFocus: false,
    });
};

export const useGetStaffActivityReportQuery = (date?: string) => {
    return useQuery({
        queryKey: ["reports", "staff-activity", date],
        queryFn: () => reportApi.getStaffActivity(date),
        refetchOnWindowFocus: false,
    });
};
