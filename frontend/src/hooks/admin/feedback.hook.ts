import { feedbackApi } from "@/api/admin/feedback.api";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedbacksQuery = (query: { page: number, limit: number, search?: string }) => {
    return useQuery({
        queryKey: ['feedbacks', 'list', query],
        queryFn: () => feedbackApi.getFeedbacks(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
}

export const useGetFeedbackStatsQuery = () => {
    return useQuery({
        queryKey: ['feedbacks', 'stats'],
        queryFn: feedbackApi.getFeedbackStats,
        refetchOnWindowFocus: false
    })
}

export const useGetFeedbackByIdQuery = (id: string | undefined | null) => {
    return useQuery({
        queryKey: ['feedback', 'byId', id],
        queryFn: () => feedbackApi.getFeedbackById(id || ""),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false,
    })
}