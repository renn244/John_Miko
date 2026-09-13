import { feedbackApi } from "@/features/admin/feedback/api/adminFeedback.api";
import type { FeedbackStats } from "@/features/shared/feedback/types/feedback.type";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedbacksQuery = (query: { page: number, limit: number, search?: string }) => {
    return useQuery({
        queryKey: ['feedbacks', 'list', query],
        queryFn: () => feedbackApi.getFeedbacks(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
}

export const useGetFeedbackOverviewQuery = (date?: string) => {
    return useQuery({
        queryKey: ['feedbacks', 'overview', date],
        queryFn: () => feedbackApi.getFeedbackOverview(date),
        refetchOnWindowFocus: false
    })
}

export const useGetFeedbackStatsQuery = () => {
    return useQuery<FeedbackStats>({
        queryKey: ['feedbacks', 'stats'],
        queryFn: () => feedbackApi.getFeedbackStats(),
        refetchOnWindowFocus: false,
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

export const useGetRecentFeedbacksQuery = (limit = 5) => {
    return useQuery({
        queryKey: ['feedbacks', 'recent', limit],
        queryFn: () => feedbackApi.getFeedbacks({ page: 1, limit }),
        refetchOnWindowFocus: false,
    })
}
