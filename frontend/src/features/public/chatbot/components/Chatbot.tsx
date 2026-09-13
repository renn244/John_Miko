import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useChatbotMessageMutation } from "@/features/public/chatbot/hooks/useChatbot";
import type { ChatbotHistoryTurn } from "@/features/public/chatbot/types/chatbot.type";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type ChatMessage = {
  id: string;
  sender: "guest" | "assistant";
  text: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  sender: "assistant",
  text: "Hi! Ask me about public resort information, accommodations, menu items, or add-on services.",
};

const ChatbotMain = ({ close }: { close: () => void }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageMutation = useChatbotMessageMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messageMutation.isPending]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || messageMutation.isPending) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: `guest-${Date.now()}`, sender: "guest", text: question },
    ]);

    try {
      const history: ChatbotHistoryTurn[] = messages
        .filter((message) => message.id !== welcomeMessage.id)
        .slice(-6)
        .map((message) => ({
          role: message.sender === "guest" ? "user" : "assistant",
          content: message.text,
        }));
      const response = await messageMutation.mutateAsync({
        message: question,
        history,
      });
      setMessages((current) => [
        ...current,
        {
          id: response.id,
          sender: "assistant",
          text: response.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          text: error instanceof Error
            ? error.message
            : "The resort assistant is unavailable right now.",
        },
      ]);
    }
  };

  return (
    <section
      aria-label="Resort assistant"
      className="flex h-[min(640px,calc(100vh-96px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
    >
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
            <Bot className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">Resort Assistant</h2>
            <p className="text-xs text-primary-foreground/75">Ask about public resort information</p>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={close} aria-label="Close chatbot" className="text-white hover:bg-white/15 hover:text-white">
          <X />
        </Button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 p-4">
        {messages.map((message) => (
          <div key={message.id} className={message.sender === "guest" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                message.sender === "guest"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm border bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm"
              }
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}

        {messageMutation.isPending ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border bg-background px-4 py-4 shadow-sm" aria-label="Assistant is thinking">
              {[0, 1, 2].map((item) => (
                <span key={item} className="size-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${item * 120}ms` }} />
              ))}
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about the resort…"
            maxLength={500}
            aria-label="Chat message"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || messageMutation.isPending} aria-label="Send message">
            <Send />
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Public information only. Confirm important details with resort staff.
        </p>
      </form>
    </section>
  );
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon-lg"
          className="fixed bottom-5 right-5 z-40 size-13 rounded-full shadow-lg"
          aria-label="Open resort assistant"
        >
          <MessageCircle className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={12} className="w-auto border-0 bg-transparent p-0 shadow-none">
        <ChatbotMain close={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};

export default Chatbot;
