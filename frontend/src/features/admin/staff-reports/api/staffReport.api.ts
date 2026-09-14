import type { GetStaffReportsAdminQuery, PaginatedStaffReports, ReviewStaffReportDto, StaffReport, StaffReportOverview } from "@/features/admin/staff-reports/types/staff-report.type";
import apiClient from "@/lib/apiClient"

export const staffReportApi = {
    getStaffReportOverview: async (date?: string) => {
        const response = await apiClient.get('/staff-reports/overview', {
            params: { date }
        })

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching the staff report overview')
        }

        return response.data as StaffReportOverview
    },
    getStaffReports: async (query: GetStaffReportsAdminQuery) => {
        const response = await apiClient.get('/staff-reports', { params: query });

        if (response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching staff reports');
        }

        return response.data as PaginatedStaffReports;
    },
    getStaffReportById: async (id: string) => {
        const response = await apiClient.get(`/staff-reports/${id}`);

        if (response.status === 404) {
            return null;
        }

        if (response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the staff report');
        }

        return response.data as StaffReport;
    },
    reviewStaffReport: async (id: string, data: ReviewStaffReportDto) => {
        const response = await apiClient.patch(`/staff-reports/${id}/review`, data);

        if (response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while reviewing the staff report');
        }

        return response.data as StaffReport;
    },
}
