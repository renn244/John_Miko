import { useInteractWithChatbotMutation } from "@/hooks/admin/chatbot.rule.hook"
import { Bot, MessageCircle, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type chatBotMessage = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    quickReplies?: { label: string; value: string }[];
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<chatBotMessage[]>([]);
    const ref = useRef<HTMLDivElement>(null);
    
    const { 
        mutateAsync, 
        isPending: isLoadingResponse
    } = useInteractWithChatbotMutation();

    useEffect(() => {
        getBotResponse("Main Menu");
    }, [])

    useEffect(() => {
        if(ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }  
    }, [messages])

    const getBotResponse = (userMessage: string) => {
        const normalizedInput = userMessage.toLowerCase();
        
        mutateAsync(
            { message: normalizedInput || "Main Menu" },
            { 
                onSuccess: (response) => {
                    const botMessage: chatBotMessage = {
                        id: response.id,
                        sender: 'bot',
                        text: response.response,
                        quickReplies: response.quickReplies.map((qr: string) => ({ label: qr, value: qr })),
                        timestamp: new Date(),
                    }

                    setMessages((prev) => [...prev, botMessage]);
                }
            }
        )
    }

    const handleQuickReply = (value: string) => {
        const userMessage: chatBotMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: value,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage]);

        setTimeout(() => {
            getBotResponse(value);
        }, 500)
    }

    const handleSendMessage = () => {
        if(!input.trim()) return;

        const userMessage: chatBotMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        setTimeout(() => {
            getBotResponse(input);
        }, 500)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size="icon-lg" className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full fixed bottom-5 right-5">
                    <MessageCircle className="w-8 h-8 text-white" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="start" alignOffset={10} className="p-0 border-0 ring-0 rounded-xl fixed bottom-5 right-10">
                <div
                className="w-95 h-150 bg-white rounded-xl border-2 z-40 flex flex-col overflow-hidden"
                style={{ maxWidth: 'calc(100vw - 48px)' }}
                >
                    <div className="p-4 flex items-center justify-between bg-primary">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/75">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Resort Assistant</h3>
                                <p className="text-xs text-white/80">Online</p>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5 text-white" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div key={message.id + index}>
                                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex items-end gap-2 max-w-[80%]">
                                        {message.sender === 'bot' && (
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary">
                                                <Bot className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                        
                                        <div>
                                            <div
                                            className="px-4 py-3 rounded-2xl border"
                                            style={{
                                                backgroundColor: message.sender === 'user' ? '#1447e6' : '#FFFFFF',
                                                color: message.sender === 'user' ? '#FFFFFF' : '#1F2937',
                                                borderBottomLeftRadius: message.sender === 'bot' ? '4px' : '16px',
                                                borderBottomRightRadius: message.sender === 'user' ? '4px' : '16px',
                                            }}
                                            >
                                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                                            </div>
                                            <p className={`text-xs mt-1 px-1 text-muted-foreground ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {message.timestamp.toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {message.sender === 'bot' && message.quickReplies && (
                                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                                        {message.quickReplies.map((reply) => (
                                            <Button
                                            disabled={isLoadingResponse}
                                            onClick={() => handleQuickReply(reply.value)}
                                            variant="outline"
                                            key={reply.value}
                                            >
                                                {reply.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={ref} />
                    </div>

                    <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                            <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if(isLoadingResponse) return;
                                
                                if(e.key === 'Enter') {
                                    if(!input.trim()) return;
                                    
                                    handleSendMessage();
                                }
                            }}
                            type="text" placeholder="Type your message..." />
                            <Button disabled={isLoadingResponse} onClick={() => handleSendMessage()}>
                                <Send className="w-5 h-5 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Chatbot