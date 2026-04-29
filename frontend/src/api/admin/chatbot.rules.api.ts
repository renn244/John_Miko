import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type { ChatbotRule, ChatbotRuleStatistics, GetChatbotRuleQuery } from "@/types/chatbot-rule.types";
import type { PaginatedResponse } from "@/types/pagination.type";

export const chatbotRulesApi = {
    createRule: async (data: any) => {
        const response = await apiClient.post('/rules', data);

        if(response.status >= 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while creating the rule.');
        }

        return response.data as ChatbotRule;
    },
    interactWithChatbot: async (data: any) => {
        const response = await apiClient.post('/rules/chatbot', data);

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while interacting with the chatbot.');
        }

        return response.data as ChatbotRule;
    },
    getRules: async (query: GetChatbotRuleQuery) => {
        const response = await apiClient.get('/rules', { params: query });

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching rules.');
        }

        return response.data as PaginatedResponse<ChatbotRule>;
    },
    getStatisticsRules: async () => {
        const response = await apiClient.get('/rules/statistics');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching rules statistics.');
        }

        return response.data as ChatbotRuleStatistics ;
    },
    getActiveRules: async () => {
        const response = await apiClient.get('/rules/active');

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching active rules.');
        }

        return response.data as ChatbotRule[];
    },
    getRuleById: async (id: string) => {
        const response = await apiClient.get(`/rules/${id}`);

        if(response.status === 404) {
            return null;
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while fetching the rule.');
        }

        return response.data as ChatbotRule;
    },
    updateRuleAvailability: async (id: string, isActive: boolean) => {
        const response = await apiClient.patch(`/rules/availability/${id}`, { isActive });

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating rule availability.');            
        }

        return response.data as ChatbotRule;
    },
    updateRule: async (id: string, data: any) => {
        const response = await apiClient.patch(`/rules/${id}`, data);

        if(response.status === 400) {
            throw new ValidationError(response.data);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while updating the rule.');            
        }

        return response.data as ChatbotRule;
    },
    deleteRule: async (id: string) => {
        const response = await apiClient.delete(`/rules/${id}`);
        
        if(response.status >= 400) {
            throw new Error(response.data.message || 'An error occurred while deleting the rule.');
        }

        return response.data as ChatbotRule;
    }
}