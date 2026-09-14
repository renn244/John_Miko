import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { CreateStaffDto, GetStaffsQuery, StaffUser, UpdateStaffRoleDto } from "@/features/admin/staff-management/types/staff-management.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const staffManagementApi = {
    createStaff: async (data: CreateStaffDto) => {
        const response = await apiClient.post('/staff-management', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while creating the staff user.');
        }

        return response.data as StaffUser;
    },
    getStaffs: async (query: GetStaffsQuery) => {
        const response = await apiClient.get('/staff-management', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching staff users.');
        }

        return response.data as PaginatedResponse<StaffUser>;
    },
    getStaffById: async (id: string) => {
        const response = await apiClient.get(`/staff-management/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the staff user.');
        }

        return response.data as StaffUser;
    },
    getRestoreCandidate: async (email: string) => {
        const response = await apiClient.get('/staff-management/restore-candidate', { params: { email } });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'A deleted staff account could not be found.');
        }

        return response.data as { id: string };
    },
    updateStaffRole: async (id: string, data: UpdateStaffRoleDto) => {
        const response = await apiClient.patch(`/staff-management/${id}/role`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating the staff role.');
        }

        return response.data as StaffUser;
    },
    deactivateStaff: async (id: string) => {
        const response = await apiClient.patch(`/staff-management/${id}/deactivate`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while deactivating the staff user.');
        }

        return response.data as StaffUser;
    },
    reactivateStaff: async (id: string) => {
        const response = await apiClient.patch(`/staff-management/${id}/reactivate`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while reactivating the staff user.');
        }

        return response.data as StaffUser;
    },
    deleteStaff: async (id: string) => {
        const response = await apiClient.patch(`/staff-management/${id}/delete`);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while deleting the staff user.');
        }

        return response.data as StaffUser;
    },
    restoreStaff: async (id: string, data: CreateStaffDto) => {
        const response = await apiClient.patch(`/staff-management/${id}/restore`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while restoring the staff user.');
        }

        return response.data as StaffUser;
    }
}
