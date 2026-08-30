import apiClient from "@/lib/apiClient";
import type { FeedbackOverview, FeedbackStats, FeedbackWithUser } from "@/types/feedback.types";
import type { PaginatedResponse } from "@/types/pagination.type";

export const feedbackApi = {
    getFeedbacks: async (query: { page: number, limit: number, search?: string }) => {
        const response = await apiClient.get('/feedback', { params: query })
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching feedbacks.');
        }
    
        return response.data as PaginatedResponse<FeedbackWithUser>;
    },
    getFeedbackOverview: async (date?: string) => {
        const response = await apiClient.get('/feedback/overview', {
            params: { date }
        });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching feedback overview.');
        }

        return response.data as FeedbackOverview;
    },
    getFeedbackStats: async () => {
        const response = await apiClient.get('/feedback/stats');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching feedback stats.');
        }

        return response.data as FeedbackStats;
    },
    getFeedbackById: async (id: string) => {
        const response = await apiClient.get(`/feedback/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the feedback.');
        }

        return response.data as FeedbackWithUser;
    }
}
