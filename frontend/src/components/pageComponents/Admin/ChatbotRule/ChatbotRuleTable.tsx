import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllChatbotRulesAdminQuery } from "@/hooks/admin/chatbot.rule.hook";
import { useChatbotAdminStore } from "@/store/admin/chatbotAdmin.store";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router";

const ChatbotRuleTable = () => {
    const { data: chatbotRules, isLoading } = useGetAllChatbotRulesAdminQuery();
    const setViewId = useChatbotAdminStore((state) => state.setViewId);
    const setDeleteId = useChatbotAdminStore((state) => state.setDeleteId);

    if(isLoading) return null;

    return (
        <Card className="px-4 min-h-147.5">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Keywords</TableHead>
                        <TableHead>Response Preview</TableHead>
                        <TableHead>Quick Replies</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {chatbotRules?.map((rule: any) => (
                        <TableRow className="h-15" key={rule.id}>
                            <TableCell className="flex flex-col gap-1">
                                <span className="font-semibold">{rule.name}</span>
                                <span className="text-xs">Updated {new Date(rule.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </TableCell>
                            <TableCell className="space-x-1">
                                {rule.keywords.slice(0, 3).map((keyword: string, i: number) => (
                                    <span 
                                    key={i}
                                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                                {rule.keywords.length > 3 && (
                                    <span
                                    className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium"
                                    >
                                        +{rule.keywords.length - 3}
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="max-w-xs">
                                <p className="text-sm line-clamp-2 text-muted-foreground">
                                    {rule.response}
                                </p>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-muted-foreground">
                                    {rule.quickReplies.length} {rule.quickReplies.length === 1 ? 'reply' : 'replies'}
                                </p>
                            </TableCell>
                            <TableCell>
                                <Badge className={
                                    rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }>
                                    {rule.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setViewId(rule.id)}>
                                            <Eye />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <Link to={`/admin/chatbot-rule/${rule.id}/edit`}>
                                            <DropdownMenuItem >
                                                <Edit />
                                                Edit
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(rule.id)}>
                                            <Trash2 />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default ChatbotRuleTable