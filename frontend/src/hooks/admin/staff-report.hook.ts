import { staffReportApi } from "@/api/admin/staff-report.api"
import { useQuery } from "@tanstack/react-query"

export const useGetStaffReportReportsQuery = () => {
    return useQuery({
        queryKey: ['staff-report', 'report'],
        queryFn: staffReportApi.getStaffReportReports,
        refetchOnWindowFocus: false
    })
}