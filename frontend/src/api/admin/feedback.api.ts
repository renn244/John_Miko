import apiClient from "@/lib/apiClient";
import type { FeedbackAnalytics, FeedbackCountPerRating, FeedbackStats, FeedbackWithUser, GetFeedbackAnalyticsQuery } from "@/types/feedback.types";
import type { PaginatedResponse } from "@/types/pagination.type";

export const feedbackApi = {
    getFeedbacks: async (query: { page: number, limit: number, search?: string }) => {
        const response = await apiClient.get('/feedback', { params: query })
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching feedbacks.');
        }
    
        return response.data as PaginatedResponse<FeedbackWithUser>;
    },
    getFeedbackReport: async () => {
        const response = await apiClient.get('/feedback/report');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occured while fetching feedbacks.')
        }
        
        return response.data as any;
    },
    getFeedbackStats: async () => {
        const response = await apiClient.get('/feedback/stats');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching feedback stats.');
        }

        return response.data as FeedbackStats;
    },
    getFeedbackAnalytics: async (query: GetFeedbackAnalyticsQuery) => {
        const response = await apiClient.get('/feedback/analytics', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching feedback analytics.');
        }

        return response.data as FeedbackAnalytics[];
    },
    getFeedbackCountPerRating: async (query: GetFeedbackAnalyticsQuery) => {
        const response = await apiClient.get('/feedback/count-per-rating', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching feedback count per rating.');
        }

        return response.data as FeedbackCountPerRating[];
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