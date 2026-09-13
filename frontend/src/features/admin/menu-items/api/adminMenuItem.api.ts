import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { CreateMenuItemDto, MenuItem, MenuItemStats, UpdateMenuItemDto } from "@/features/shared/menu-items/types/menu-item.type";

export const adminMenuItemApi = {
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
