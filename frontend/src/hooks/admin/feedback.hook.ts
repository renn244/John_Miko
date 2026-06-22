import { feedbackApi } from "@/api/admin/feedback.api";
import type { GetFeedbackAnalyticsQuery } from "@/types/feedback.types";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedbacksQuery = (query: { page: number, limit: number, search?: string }) => {
    return useQuery({
        queryKey: ['feedbacks', 'list', query],
        queryFn: () => feedbackApi.getFeedbacks(query),
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev
    })
}

export const useGetFeedbackReportQuery = (date?: string) => {
    return useQuery({
        queryKey:  ['feedback', 'report', date],
        queryFn: () => feedbackApi.getFeedbackReport(date),
        refetchOnWindowFocus: false
    })
}

export const useGetFeedbackAnalyticsQuery = (query: GetFeedbackAnalyticsQuery) => {
    return useQuery({
        queryKey: ['feedbacks', 'analytics', query],
        queryFn: () => feedbackApi.getFeedbackAnalytics(query),
        refetchOnWindowFocus: false,
    })
}

export const useGetFeedbackCountPerRatingQuery = (query: GetFeedbackAnalyticsQuery) => {
    return useQuery({
        queryKey: ['feedbacks', 'countPerRating', query],
        queryFn: () => feedbackApi.getFeedbackCountPerRating(query),
        refetchOnWindowFocus: false,
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

export const useGetRecentFeedbacksQuery = (limit = 5) => {
    return useQuery({
        queryKey: ['feedbacks', 'recent', limit],
        queryFn: () => feedbackApi.getFeedbacks({ page: 1, limit }),
        refetchOnWindowFocus: false,
    })
}
