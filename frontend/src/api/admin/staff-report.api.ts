import apiClient from "@/lib/apiClient"

export const staffReportApi = {
    getStaffReportReports: async () => {
        const response = await apiClient.get('/staff-reports/report')

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fething the reports')
        }

        return response.data as any
    }
}