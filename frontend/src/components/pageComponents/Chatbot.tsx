import { Bot, MessageCircle, Send, User, X } from "lucide-react"
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

const chatbotRules = [
    {
        id: '1',
        name: 'Accommodations',
        keywords: ['accommodation', 'room', 'cottage', 'villa', 'stay'],
        response: "We offer a variety of accommodations! 🏠\n\n• Beachfront Cottages\n• Garden Villas\n• Standard Rooms\n• Family Suites\n• Event Halls\n\nAll accommodations feature air conditioning, WiFi, and modern amenities. Would you like to see available options?",
        quickReplies: [
            { label: '🔍 View All Rooms', value: 'view_rooms' },
            { label: '💰 Check Pricing', value: 'pricing' },
            { label: '📅 Book Now', value: 'booking' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '2',
        name: 'Pricing',
        keywords: ['price', 'cost', 'rate', 'how much', 'pricing'],
        response: "Here's an overview of our pricing: 💰\n\n• Standard Rooms: ₱2,200 - ₱2,800/night\n• Cottages: ₱3,500 - ₱4,200/night\n• Villas: ₱4,200 - ₱5,500/night\n• Family Suites: ₱3,800 - ₱4,500/night\n\nPrices vary by season and may include additional fees. We offer both full payment and 50% downpayment options!",
        quickReplies: [
            { label: '🏠 View Rooms', value: 'view_rooms' },
            { label: '📅 Check Availability', value: 'booking' },
            { label: '💳 Payment Options', value: 'payment' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '3',
        name: 'Amenities',
        keywords: ['amenity', 'amenities', 'facility', 'facilities', 'feature'],
        response: "Our resort features amazing amenities! 🎯\n\n✨ Resort Facilities:\n• Infinity Swimming Pool\n• Beachfront Access\n• Restaurant & Bar\n• Free WiFi\n• Free Parking\n• Fitness Center\n• Event Venues\n\n🛏️ Room Amenities:\n• Air Conditioning\n• Smart TV\n• Premium Bedding\n• Coffee Maker\n• Private Bathroom",
        quickReplies: [
            { label: '🍽️ Restaurant Info', value: 'restaurant' },
            { label: '🏊 Pool Hours', value: 'pool' },
            { label: '🏠 View Rooms', value: 'view_rooms' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '4',
        name: 'Location',
        keywords: ['location', 'address', 'where', 'direction', 'how to get'],
        response: "We're located in a beautiful coastal area! 📍\n\n📮 Address:\nJohn Miko's Place Resort\nBeachfront Road, Coastal Area\nProvince, Philippines\n\n🚗 Directions:\n• 2 hours from Manila\n• 30 minutes from nearest airport\n• Direct beach access\n\nWe provide free parking for all guests!",
        quickReplies: [
            { label: '📞 Get Contact Info', value: 'contact' },
            { label: '📅 Book Now', value: 'booking' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '5',
        name: 'Booking',
        keywords: ['book', 'reservation', 'reserve', 'availability', 'check in'],
        response: "Ready to book your stay? 📅\n\n🕐 Check-in: 2:00 PM\n🕐 Check-out: 12:00 PM\n\nYou can choose between:\n• Overnight Stay (12:00 PM - 1:00 AM)\n• Day Stay (1:00 AM - 11:00 PM)\n\nTo make a reservation, simply browse our accommodations and select your preferred dates!",
        quickReplies: [
            { label: '🏠 View Accommodations', value: 'view_rooms' },
            { label: '💳 Payment Options', value: 'payment' },
            { label: '❌ Cancellation Policy', value: 'cancellation' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '6',
        name: 'Contact',
        keywords: ['contact', 'phone', 'email', 'call', 'reach'],
        response: "Feel free to reach out! 📞\n\n📧 Email:\ninfo@johnmikosplace.com\n\n📱 Phone:\n+63 917 123 4567\n+63 918 234 5678\n\n⏰ Hours:\nMonday - Sunday: 8:00 AM - 8:00 PM\n\nWe're here to help with any questions!",
        quickReplies: [
            { label: '📍 Get Directions', value: 'location' },
            { label: '📅 Book Now', value: 'booking' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '7',
        name: 'Payment',
        keywords: ['payment', 'pay'],
        response: "We offer flexible payment options! 💳\n\n✅ Full Payment:\n• Pay 100% at booking\n• No balance due at check-in\n\n✅ 50% Downpayment:\n• Pay 50% at booking\n• Remaining 50% at check-in\n\nAccepted methods:\n• Credit/Debit Cards\n• Bank Transfer\n• Cash (on-site)",
        quickReplies: [
            { label: '📅 Book Now', value: 'booking' },
            { label: '❌ Cancellation Policy', value: 'cancellation' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '8',
        name: 'Cancellation',
        keywords: ['cancel', 'refund'],
        response: "Our cancellation policy: ❌\n\n✅ Free cancellation up to 48 hours before check-in\n\n⚠️ Cancellations within 48 hours:\n• 50% refund for full payment\n• Downpayment is non-refundable\n\n💡 We recommend booking in advance and reviewing your dates carefully!",
        quickReplies: [
            { label: '📅 Book Now', value: 'booking' },
            { label: '📞 Contact Us', value: 'contact' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '9',
        name: 'Restaurant',
        keywords: ['restaurant', 'food', 'dining'],
        response: "Our restaurant serves delicious meals! 🍽️\n\n🍴 Cuisine:\n• Filipino specialties\n• International dishes\n• Fresh seafood\n• Vegetarian options\n\n⏰ Operating Hours:\n• Breakfast: 6:00 AM - 10:00 AM\n• Lunch: 11:00 AM - 2:00 PM\n• Dinner: 5:00 PM - 9:00 PM\n\nYou can also pre-order meals with your booking!",
        quickReplies: [
            { label: '📅 Book with Meals', value: 'booking' },
            { label: '🎯 Other Amenities', value: 'amenities' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
    {
        id: '10',
        name: 'Pool',
        keywords: ['pool', 'swimming'],
        response: "Our infinity pool is stunning! 🏊\n\n⏰ Pool Hours:\n• Daily: 6:00 AM - 8:00 PM\n\n✨ Features:\n• Ocean view infinity edge\n• Adult and kids sections\n• Poolside loungers\n• Complimentary towels\n\n🌅 Perfect for sunset swims!",
        quickReplies: [
            { label: '🎯 Other Amenities', value: 'amenities' },
            { label: '📅 Book Now', value: 'booking' },
            { label: '🔙 Main Menu', value: 'menu' },
        ],
        isActive: true,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
    },
];

// Helper functions
export const getChatbotRules = (): typeof chatbotRules => {
  return chatbotRules.filter(rule => rule.isActive);
};


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<chatBotMessage[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!isOpen && messages.length === 0) {
            const welcomeMessage: chatBotMessage = {
                id: 'welcome',
                sender: 'bot',
                text: "Hello! Welcome to John Miko's Place Resort! I'm here to help you with any questions. What would you like to know?",
                timestamp: new Date(),
                quickReplies: [
                    { label: '🏠 Accommodations', value: 'accommodations' },
                    { label: '💰 Pricing', value: 'pricing' },
                    { label: '🎯 Amenities', value: 'amenities' },
                    { label: '📍 Location', value: 'location' },
                    { label: '📅 Booking', value: 'booking' },
                    { label: '📞 Contact', value: 'contact' },
                ]
            }
            
            setMessages([welcomeMessage]);
        }
    }, [])

    useEffect(() => {
        if(ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }  
    }, [messages])

    const getBotResponse = (userMessage: string): chatBotMessage => {
        const normalizedInput = userMessage.toLowerCase();
        const rules = getChatbotRules();

        for (const rule of rules) {
            const hasMatch = rule.keywords.some(keyword => normalizedInput.includes(keyword));

            if(hasMatch) {
                return {
                    id: Date.now().toString(),
                    text: rule.response,
                    sender: 'bot',
                    timestamp: new Date(),
                    quickReplies: rule.quickReplies,
                }
            }
        }

        if (normalizedInput.includes('menu') || normalizedInput.includes('start over') || normalizedInput.includes('main')) {
            return {
                id: Date.now().toString(),
                text: "What would you like to know about John Miko's Place Resort?",
                sender: 'bot',
                timestamp: new Date(),
                quickReplies: [
                    { label: '🏠 Accommodations', value: 'accommodations' },
                    { label: '💰 Pricing', value: 'pricing' },
                    { label: '🎯 Amenities', value: 'amenities' },
                    { label: '📍 Location', value: 'location' },
                    { label: '📅 Booking', value: 'booking' },
                    { label: '📞 Contact', value: 'contact' },
                ],
            };
        }

        // Default response when no matches are found
        return {
            id: Date.now().toString(),
            text: "I'm here to help! I can answer questions about:\n\n• Accommodations & Rooms\n• Pricing & Rates\n• Amenities & Facilities\n• Location & Directions\n• Booking Process\n• Contact Information\n\nWhat would you like to know?",
            sender: 'bot',
            timestamp: new Date(),
            quickReplies: [
                { label: '🏠 Accommodations', value: 'accommodations' },
                { label: '💰 Pricing', value: 'pricing' },
                { label: '🎯 Amenities', value: 'amenities' },
                { label: '📞 Contact', value: 'contact' },
            ],
        };
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
            const botResponse = getBotResponse(value);
            setMessages(prev => [...prev, botResponse]);
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
            const botResponse = getBotResponse(input);
            setMessages((prev) => [...prev, botResponse]);
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
                        {messages.map((message) => (
                            <div key={message.id}>
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
                                            <p className="text-xs mt-1 px-1 text-muted-foreground">
                                                {message.timestamp.toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>

                                        {message.sender === 'user' && (
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {message.sender === 'bot' && message.quickReplies && (
                                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                                        {message.quickReplies.map((reply) => (
                                            <Button
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
                                if(e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            type="text" placeholder="Type your message..." />
                            <Button onClick={() => handleSendMessage()}>
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