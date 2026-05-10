import { staffManagementApi } from "@/api/admin/staff-management.api";
import type { GetStaffsQuery, StaffStats, UpdateStaffRoleDto } from "@/types/admin/staff-management.type";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateStaffMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['staff-management', 'create'],
        mutationFn: staffManagementApi.createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'stats'] });
            navigate('/admin/staff-management');
        }
    })
}

export const useGetStaffsQuery = (query: GetStaffsQuery) => {
    return useQuery({
        queryKey: ['staff-management', 'list', query],
        queryFn: () => staffManagementApi.getStaffs(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    });
}

export const useGetStaffById = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['staff-management', 'byId', id],
        queryFn: () => staffManagementApi.getStaffById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const useUpdateStaffRoleMutation = (id: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['staff-management', 'update-role', id],
        mutationFn: (data: UpdateStaffRoleDto) => staffManagementApi.updateStaffRole(id || "", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'byId', id] });
        }
    })
}

export const useDeactivateStaffMutation = (id: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['staff-management', 'deactivate', id],
        mutationFn: () => staffManagementApi.deactivateStaff(id || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'byId', id] });
        }
    })
}

export const useReactivateStaffMutation = (id: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['staff-management', 'reactivate', id],
        mutationFn: () => staffManagementApi.reactivateStaff(id || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['staff-management', 'byId', id] });
        }
    })
}

export const useGetStaffStatsQuery = () => {
    const queries = useQueries({
        queries: [
            {
                queryKey: ['staff-management', 'stats', 'total'],
                queryFn: () => staffManagementApi.getStaffs({ page: 1, limit: 1 }),
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['staff-management', 'stats', 'active'],
                queryFn: () => staffManagementApi.getStaffs({ page: 1, limit: 1, status: 'ACTIVE' }),
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['staff-management', 'stats', 'inactive'],
                queryFn: () => staffManagementApi.getStaffs({ page: 1, limit: 1, status: 'INACTIVE' }),
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['staff-management', 'stats', 'kitchen'],
                queryFn: () => staffManagementApi.getStaffs({ page: 1, limit: 1, role: 'KITCHEN_STAFF' }),
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['staff-management', 'stats', 'resort'],
                queryFn: () => staffManagementApi.getStaffs({ page: 1, limit: 1, role: 'RESORT_STAFF' }),
                refetchOnWindowFocus: false,
            },
        ]
    })

    const isLoading = queries.some((query) => query.isLoading);

    const data: StaffStats = {
        total: queries[0]?.data?.meta.total || 0,
        active: queries[1]?.data?.meta.total || 0,
        inactive: queries[2]?.data?.meta.total || 0,
        kitchen: queries[3]?.data?.meta.total || 0,
        resort: queries[4]?.data?.meta.total || 0,
    };

    return {
        data,
        isLoading,
        queries,
    }
}
