import { menuItemApi } from "@/api/admin/menu-item.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useCreateMenuItemMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['menu-item', 'create'],
        mutationFn: menuItemApi.createMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'categories'] });
            navigate('/admin/menu-item');
        }
    })
}

export const useGetMenuItemsQuery = (query: any) => {
    return useQuery({
        queryKey: ['menu-item', 'list', query],
        queryFn: () => menuItemApi.getMenuItems(query),
        refetchOnWindowFocus: false,
    })
}

export const useGetMenuItemsBulkQuery = (ids: string[] | undefined) => {
    return useQuery({
        queryKey: ['menu-item', 'bulk', ids],
        queryFn: () => menuItemApi.getMenuItemsBulk(ids || []),
        enabled: !!ids && ids.length > 0,
        refetchOnWindowFocus: false,
    })
}

export const useGetMenuItemCategoriesQuery = () => {
    return useQuery({
        queryKey: ['menu-item', 'categories'],
        queryFn: menuItemApi.getMenuItemCategories,
        refetchOnWindowFocus: false,
    })
}

export const useGetMenuItemStatsQuery = () => {
    return useQuery({
        queryKey: ['menu-item', 'stats'],
        queryFn: menuItemApi.getMenuItemStats,
        refetchOnWindowFocus: false,
    })
}

export const useGetMenuItemById = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['menu-item', 'byId', id],
        queryFn: () => menuItemApi.getMenuItemById(id || ""),
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
        mutationFn: (data: any) => menuItemApi.updateMenuItem(id, data),
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
        mutationFn: (availability: string) => menuItemApi.updateMenuItem(id, { availability }),
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
        mutationFn: () => menuItemApi.deleteMenuItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['menu-item', 'stats'] });
        }
    });
}
