import { staffReportApi } from "@/api/admin/staff-report.api"
import type { GetStaffReportsAdminQuery, ReviewStaffReportDto } from "@/types/admin/staff-report.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetStaffReportReportsQuery = () => {
    return useQuery({
        queryKey: ['staff-report', 'report'],
        queryFn: staffReportApi.getStaffReportReports,
        refetchOnWindowFocus: false
    })
}

export const useGetStaffReportsQuery = (query: GetStaffReportsAdminQuery) => {
    return useQuery({
        queryKey: ['staff-report', 'list', query],
        queryFn: () => staffReportApi.getStaffReports(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })
}

export const useGetStaffReportByIdQuery = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['staff-report', 'byId', id],
        queryFn: () => staffReportApi.getStaffReportById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const useReviewStaffReportMutation = (reportId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['staff-report', 'review', reportId],
        mutationFn: (data: ReviewStaffReportDto) => staffReportApi.reviewStaffReport(reportId, data),
        onSuccess: (data) => {
            toast.success(`Report ${data.status.toLowerCase()} successfully.`);
            queryClient.invalidateQueries({ queryKey: ['staff-report', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['staff-report', 'report'] });
            queryClient.invalidateQueries({ queryKey: ['staff-report', 'byId', reportId] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to review the staff report.');
        }
    })
}
