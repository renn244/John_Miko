import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { CreateMenuItemDto, getMenuItemsQuery, MenuItem, MenuItemStats, UpdateMenuItemDto } from "@/types/admin/menu-item.type";
import type { PaginatedResponse } from "@/types/pagination.type";


export const menuItemApi = {
    createMenuItem: async (data: CreateMenuItemDto) => {
        const response = await apiClient.post('/menu-item', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while creating the menu item.');
        }

        return response.data as MenuItem;
    },
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
    getMenuItemStats: async () => {
        const response = await apiClient.get('/menu-item/stats');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching menu item stats.');
        }

        return response.data as MenuItemStats;
    },
    getMenuItemById: async (id: string) => {
        const response = await apiClient.get(`/menu-item/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the menu item.');
        }

        return response.data as MenuItem;
    },
    updateMenuItem: async (id: string, data: UpdateMenuItemDto) => {
        const response = await apiClient.patch(`/menu-item/${id}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating the menu item.');
        }

        return response.data as MenuItem;
    },
    deleteMenuItem: async (id: string) => {
        const response = await apiClient.delete(`/menu-item/${id}`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while deleting the menu item.');
        }

        return response.data as MenuItem;
    }
}