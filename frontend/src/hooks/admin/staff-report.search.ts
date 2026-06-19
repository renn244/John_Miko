import { updateSearchParams } from "@/lib/updateSearchParams";
import { useSearchParams } from "react-router";

export const useStaffReportSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('reportSearch') || undefined;
    const status = searchParams.get('reportStatus') || undefined;
    const type = searchParams.get('reportType') || undefined;
    const severity = searchParams.get('reportSeverity') || undefined;
    const page = parseInt(searchParams.get('reportPage') || '1', 10);
    const limit = 10;

    const updateSearch = (newSearch: string) =>
        updateSearchParams(setSearchParams, { reportSearch: newSearch, reportPage: undefined });

    const updateStatus = (newStatus: string | "all") =>
        updateSearchParams(setSearchParams, { reportStatus: newStatus === "all" ? undefined : newStatus, reportPage: undefined });

    const updateType = (newType: string | "all") =>
        updateSearchParams(setSearchParams, { reportType: newType === "all" ? undefined : newType, reportPage: undefined });

    const updateSeverity = (newSeverity: string | "all") =>
        updateSearchParams(setSearchParams, { reportSeverity: newSeverity === "all" ? undefined : newSeverity, reportPage: undefined });

    const updatePage = (newPage: number) =>
        updateSearchParams(setSearchParams, { reportPage: newPage.toString() });

    const clearFilters = () => setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        ['reportSearch', 'reportStatus', 'reportType', 'reportSeverity', 'reportPage'].forEach((key) => next.delete(key));
        return next;
    }, { replace: true });

    return {
        search,
        status,
        type,
        severity,
        page,
        limit,
        updateSearch,
        updateStatus,
        updateType,
        updateSeverity,
        updatePage,
        clearFilters,
    }
}
