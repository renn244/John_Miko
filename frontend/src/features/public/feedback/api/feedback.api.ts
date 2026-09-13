import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { Feedback, FeedbackWithUser } from "@/features/shared/feedback/types/feedback.type";

export const feedbackApi = {
    createFeedback: async (data: { bookingId: string, rating: number, comment?: string }) => {
        const response = await apiClient.post('/feedback', data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while creating feedback.');
        }

        return response.data as Feedback;
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
    },
    updateFeedback: async (feedbackId: string, data: { rating: number, comment?: string }) => {
        const response = await apiClient.patch(`/feedback/${feedbackId}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating feedback.');
        }

        return response.data as Feedback;
    },
    deleteFeedback: async (feedbackId: string) => {
        const response = await apiClient.delete(`/feedback/${feedbackId}`);
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while deleting feedback.');
        }

        return response.data as Feedback;
    }
}