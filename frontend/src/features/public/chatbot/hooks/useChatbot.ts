import { chatbotApi } from "@/features/public/chatbot/api/chatbot.api";
import { useMutation } from "@tanstack/react-query";

export const useChatbotMessageMutation = () =>
  useMutation({
    mutationKey: ["chatbot", "message"],
    mutationFn: chatbotApi.sendMessage,
  });
