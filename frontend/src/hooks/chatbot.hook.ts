import { chatbotApi } from "@/api/chatbot.api";
import { useMutation } from "@tanstack/react-query";

export const useChatbotMessageMutation = () =>
  useMutation({
    mutationKey: ["chatbot", "message"],
    mutationFn: chatbotApi.sendMessage,
  });
