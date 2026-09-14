import type { ReportSeverity, ReportStatus, ReportType } from "@/features/admin/staff-reports/types/staff-report.type";

export const getStaffReportStatusClasses = (status: ReportStatus) => {
    switch (status) {
        case "Approved":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "Rejected":
            return "bg-red-100 text-red-700 border-red-200";
        default:
            return "bg-amber-100 text-amber-700 border-amber-200";
    }
}

export const getStaffReportSeverityClasses = (severity: ReportSeverity) => {
    switch (severity) {
        case "High":
            return "bg-red-100 text-red-700 border-red-200";
        case "Medium":
            return "bg-amber-100 text-amber-700 border-amber-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

export const getStaffReportTypeClasses = (type: ReportType) => {
    switch (type) {
        case "checkIn":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "checkOut":
            return "bg-violet-100 text-violet-700 border-violet-200";
        default:
            return "bg-orange-100 text-orange-700 border-orange-200";
    }
}

export const formatStaffReportType = (type: ReportType) => {
    switch (type) {
        case "checkIn":
            return "Check-In";
        case "checkOut":
            return "Check-Out";
        default:
            return "Maintenance";
    }
}
