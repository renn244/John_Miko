import { Button } from "@/components/ui/button";
import { useGetFeedbacksQuery } from "@/hooks/admin/feedback.hook";
import { useFeedbackAdminStore } from "@/store/admin/feedbackAdmin.store";
import { formatDate } from "date-fns";
import { Calendar, Eye, MessageSquare, Star, User } from "lucide-react";

const FeedbackList = () => {
    const setViewId = useFeedbackAdminStore((state) => state.setViewId);
    const { data, isLoading, isError } = useGetFeedbacksQuery();

    if(isLoading) return null

    if(isError) return null

    return (
        <div className="space-y-4">
            {data?.map((feedback) => {
                return (
                    <div key={feedback.id} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">

                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        {/* <h3 className="font-semibold">
                                            {feedback.title}
                                        </h3> */}
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {feedback.user.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(feedback.createdAt, "PPP")}
                                            </span>
                                            {feedback.id && (
                                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted">
                                                    {feedback.id}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 ml-4">
                                        {[...Array(5)].map((_, i) => {
                                            const ratingValue = i + 1;
                                            
                                            return (
                                                <Star
                                                key={ratingValue}
                                                className="w-5 h-5"
                                                fill={ratingValue <= feedback.rating ? '#F59E0B' : 'none'}
                                                style={{ color: '#F59E0B' }}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>

                                <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
                                    {feedback.comment}
                                </p>

                                <Button onClick={() => setViewId(feedback.id)}>
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {(data && data.length === 0) && (
                <div className="rounded-xl p-12 text-center col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-xl font-bold mb-2">
                        No feedback found
                    </h3>
                    <p className="text-sm mb-6 text-muted-foreground">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            )}
        </div>
    )
}

export default FeedbackList