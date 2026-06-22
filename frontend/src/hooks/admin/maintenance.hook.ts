import { maintenanceApi } from "@/api/admin/maintenane.api";
import type { CompleteMaintenanceDto, GetMaintenancesQuery } from "@/types/admin/maintenance.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateMaintenanceMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['maintenance', 'create'],
        mutationFn: maintenanceApi.createMaintenance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'stats'] });
            navigate('/admin/maintenance');
        }
    })
}

export const useGetMaintenancesQuery = (query: GetMaintenancesQuery) => {
    return useQuery({
        queryKey: ['maintenance', 'list', query],
        queryFn: () => maintenanceApi.getMaintenances(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev 
    });
}

export const useGetMaintenanceReportQuery = (date?: string) => {
    return useQuery({
        queryKey: ['maintenance', 'report', date],
        queryFn: () => maintenanceApi.getMaintenanceReport(date),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
}

export const useGetMaintenanceStatsQuery = () => {
    return useQuery({
        queryKey: ['maintenance', 'stats'],
        queryFn: maintenanceApi.getMaintenanceStats,
        refetchOnWindowFocus: false,
    })
}

export const useGetMaintenancebyId = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['maintenance', 'byId', id],
        queryFn: () => maintenanceApi.getMaintenanceById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const useUpdateMaintenanceMutation = (id: string | undefined | null) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['maintenance', 'update', id],
        mutationFn: (data: any) => maintenanceApi.updateMaintenance(id || "", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'byId', id] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'stats'] });
            navigate('/admin/maintenance');
        }
    })
}

export const useStartMaintnenanceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['maintenance', 'start'],
        mutationFn: (id: string) => maintenanceApi.startMaintenance(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'byId', id] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'stats'] });
        }
    });
};

export const useCompleteMaintenanceMutation = (id: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['maintenance', 'complete', id],
        mutationFn: (data: CompleteMaintenanceDto) => maintenanceApi.completeMaintenance(id || "", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'byId', id] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'stats'] });
        }
    })
}

export const useClosedMaintenanceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['maintenance', 'close'],
        mutationFn: (id: string) => maintenanceApi.closeMaintenance(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'byId', id] });
            queryClient.invalidateQueries({ queryKey: ['maintenance', 'stats'] });
        }
    });
};
