import { chatbotRulesApi } from "@/api/admin/chatbot.rules.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateChatbotRuleAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['chatbot', 'rule', 'create', 'admin'],
        mutationFn: (data: any) => chatbotRulesApi.createRule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin'] })
        }
    })
}

export const useInteractWithChatbotMutation = () => {
    return useMutation({
        mutationKey: ['chatbot', 'interact'],
        mutationFn: chatbotRulesApi.interactWithChatbot,
    })
}

export const useGetAllChatbotRulesAdminQuery = () => {
    return useQuery({
        queryKey: ['chatbot', 'rules', 'admin'],
        queryFn: chatbotRulesApi.getRules,
        refetchOnWindowFocus: false,
    })
}

export const useGetChatbotRuleStatisticsAdminQuery = () => {
    return useQuery({
        queryKey: ['chatbot', 'rules', 'statistics', 'admin'],
        queryFn: chatbotRulesApi.getStatisticsRules,
        refetchOnWindowFocus: false,
    })
}

export const useGetActiveChatbotRulesAdminQuery = () => {
    return useQuery({
        queryKey: ['chatbot', 'rules', 'active', 'admin'],
        queryFn: chatbotRulesApi.getActiveRules,
        refetchOnWindowFocus: false,
    })
}

export const useGetChatbotRuleByIdAdminQuery = (ruleId: string | undefined | null) => {
    return useQuery({
        queryKey: ['chatbot', 'rules', 'admin', 'byId', ruleId],
        queryFn: () => chatbotRulesApi.getRuleById(ruleId || ""),
        enabled: !!ruleId,
    })
}

export const useUpdateChatbotRuleAvailabilityAdminMutation = (ruleId: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['chatbot', 'rule', 'updateAvailability', 'admin', ruleId],
        mutationFn: (isActive: boolean) => chatbotRulesApi.updateRuleAvailability(ruleId || "", isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'active', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin', 'byId', ruleId] })
        }
    })
}

export const useUpdateChatbotRuleAdminMutation = (ruleId: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['chatbot', 'rule', 'update', 'admin', ruleId],
        mutationFn: (data: any) => chatbotRulesApi.updateRule(ruleId || "", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'active', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin', 'byId', ruleId] })
        }
    })
}

export const useDeleteChatbotRuleAdminMutation = (ruleId: string | undefined | null) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['chatbot', 'rule', 'delete', 'admin', ruleId],
        mutationFn: () => chatbotRulesApi.deleteRule(ruleId || ""),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'active', 'admin'] })
            queryClient.invalidateQueries({ queryKey: ['chatbot', 'rules', 'admin', 'byId', ruleId] })
        }
    })
}