import apiClient from "@/lib/apiClient";
import type { getMenuItemsQuery, MenuItem } from "@/features/shared/menu-items/types/menu-item.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const menuItemApi = {
    getMenuItems: async (query: getMenuItemsQuery) => {
        const response = await apiClient.get('/menu-item', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching menu items.');
        }

        return response.data as PaginatedResponse<MenuItem>;
    },
    getMenuItemsBulk: async (ids: string[]) => {
        const response = await apiClient.get('/menu-item/bulk', { params: { ids: ids.join(',') } });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching menu items.');
        }

        return response.data as MenuItem[];
    },
    getMenuItemCategories: async () => {
        const response = await apiClient.get('/menu-item/categories');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching menu item categories.');
        }

        return response.data as string[];
    },
}
