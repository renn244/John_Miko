import { feedbackApi } from "@/features/public/feedback/api/feedback.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateFeedbackGuestMutation = (bookingId: string) => {
    return useMutation({
        mutationKey: ['feedback', 'create', bookingId],
        mutationFn: (data: any) => feedbackApi.createFeedback({...data, bookingId })
    })
}

export const useGetFeedbackById = (feedbackId: string | null | undefined) => {
    return useQuery({
        queryKey: ['feedback', 'byId', feedbackId],
        queryFn: () => feedbackApi.getFeedbackById(feedbackId!),
        enabled: !!feedbackId
    })
}

export const useUpdateFeedbackGuestMutation = (feedbackId: string) => {
    return useMutation({
        mutationKey: ['feedback', 'update', feedbackId],
        mutationFn: (data: any) => feedbackApi.updateFeedback(feedbackId, data)
    })
}

export const useDeleteFeedbackGuestMutation = (feedbackId: string) => {
    return useMutation({
        mutationKey: ['feedback', 'delete', feedbackId],
        mutationFn: () => feedbackApi.deleteFeedback(feedbackId)
    })
}