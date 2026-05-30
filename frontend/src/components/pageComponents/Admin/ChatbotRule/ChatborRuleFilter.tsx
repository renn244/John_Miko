import { Input } from "@/components/ui/input";
import { useChatbotRuleSearch } from "@/hooks/admin/chatbot.rule.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const ChatbotRuleFilter = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex flex-col md:flex-row gap-4">
                <ChatbotRuleSearchFilter />

                {/* Add isActive Filter Later on */}
            </div>
        </div>
    )
}

const ChatbotRuleSearchFilter = () => {
    const { search, updateSearch } = useChatbotRuleSearch();
    const [searchInput, setSearchInput] = useState("");
    const debounceValue = useDebounce(searchInput, 500);

    useEffect(() => {
        if(debounceValue !== search) {
            updateSearch(debounceValue)
        }
    }, [debounceValue])

    return (
        <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
            placeholder="Search by training phrases, name, or id"
            />
        </div>
    )
}

export default ChatbotRuleFilter