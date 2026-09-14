import { adminMenuItemApi } from "@/features/admin/menu-items/api/adminMenuItem.api";
import type { MenuItem } from "@/features/shared/menu-items/types/menu-item.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateMenuItemMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['menu-item', 'create'],
        mutationFn: adminMenuItemApi.createMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'categories'] });
            navigate('/admin/menu-item');
        }
    })
}

export const useGetMenuItemStatsQuery = () => {
    return useQuery({
        queryKey: ['menu-item', 'stats'],
        queryFn: adminMenuItemApi.getMenuItemStats,
        refetchOnWindowFocus: false,
    })
}

export const useGetMenuItemById = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['menu-item', 'byId', id],
        queryFn: () => adminMenuItemApi.getMenuItemById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })
}

export const useUpdateMenuItemMutation = (id: string) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['menu-item', 'update', id],
        mutationFn: (data: any) => adminMenuItemApi.updateMenuItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'byId', id] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'categories'] });

            navigate('/admin/menu-item');
        }
    });
};

export const useUpdateMenuItemAvailabilityMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['menu-item', 'update', 'availability', id],
        mutationFn: (availability: MenuItem['availability']) => adminMenuItemApi.updateMenuItem(id, { availability }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'byId', id] });
        }
    })
}

export const useDeleteMenuItemMutation = (id: string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ['menu-item', 'delete', id],
        mutationFn: () => adminMenuItemApi.deleteMenuItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'stats'] });
        }
    });
}
