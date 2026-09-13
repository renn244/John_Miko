import { updateSearchParams } from "@/lib/updateSearchParams";
import type { StaffRole, StaffStatus } from "@/features/admin/staff-management/types/staff-management.type";
import { useSearchParams } from "react-router";

export const useStaffManagementSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || undefined;
    const role = (searchParams.get('role') || undefined) as StaffRole | undefined;
    const status = (searchParams.get('status') || undefined) as StaffStatus | undefined;
    const page = Number(searchParams.get('page') || 1);
    const limit = 10;

    const updateSearch = (newSearch: string) =>
        updateSearchParams(setSearchParams, { search: newSearch, page: undefined });

    const updateRole = (newRole: string | "all") =>
        updateSearchParams(setSearchParams, { role: newRole === "all" ? undefined : newRole, page: undefined });

    const updateStatus = (newStatus: string | "all") =>
        updateSearchParams(setSearchParams, { status: newStatus === "all" ? undefined : newStatus, page: undefined });

    const updatePage = (newPage: number) =>
        updateSearchParams(setSearchParams, { page: newPage.toString() });

    const clearFilters = () => setSearchParams({});

    return {
        search,
        role,
        status,
        page,
        limit,
        updateSearch,
        updateRole,
        updateStatus,
        updatePage,
        clearFilters
    }
}
