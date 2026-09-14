import { menuItemApi } from "@/features/shared/menu-items/api/menu-item.api";
import type { getMenuItemsQuery } from "@/features/shared/menu-items/types/menu-item.type";
import { useQuery } from "@tanstack/react-query";

export const useGetMenuItemsQuery = (query: getMenuItemsQuery) => {
    return useQuery({
        queryKey: ['menu-item', 'list', query],
        queryFn: () => menuItemApi.getMenuItems(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
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
