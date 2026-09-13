export type ChatbotResponse = {
  id: string;
  answer: string;
};

export type ChatbotHistoryTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatbotRequest = {
  message: string;
  history: ChatbotHistoryTurn[];
};
