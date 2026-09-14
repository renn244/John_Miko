import apiClient from "@/lib/apiClient";
import type { ChatbotRequest, ChatbotResponse } from "@/features/public/chatbot/types/chatbot.type";

export const chatbotApi = {
  sendMessage: async (request: ChatbotRequest) => {
    const response = await apiClient.post("/chatbot/messages", request);
    if (response.status >= 400) {
      throw new Error(response.data?.message || "The resort assistant is unavailable right now.");
    }
    return response.data as ChatbotResponse;
  },
};
