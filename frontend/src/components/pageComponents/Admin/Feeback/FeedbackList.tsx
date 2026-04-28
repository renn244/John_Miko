import DataPagination from "@/components/common/DataPagination";
import { Button } from "@/components/ui/button";
import { useGetFeedbacksQuery } from "@/hooks/admin/feedback.hook";
import { useFeedbackSearch } from "@/hooks/admin/feedback.search";
import { formatToSmartDate } from "@/lib/date.util";
import { useFeedbackAdminStore } from "@/store/admin/feedbackAdmin.store";
import { Calendar, Mail, MessageSquare, Star } from "lucide-react";

const FeedbackList = () => {
    const setViewId = useFeedbackAdminStore((state) => state.setViewId);
    const { search, page, limit, updatePage } = useFeedbackSearch();

    const { data, isLoading, isError } = useGetFeedbacksQuery({
        page, limit
    });

    const getRatingColor = (rating: number) => {
        if (rating >= 4) {
            return { bg: '#DEF7EC', color: '#0E9F6E' }
        } else {
            return { bg: '#FFF7ED', color: '#F59E0B' };
        }
    };

    if(isLoading) return null

    if(isError) return null

    const feedbacks = data?.data;
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            {feedbacks?.map((feedback) => {
                const ratingColors = getRatingColor(feedback.rating);
                
                return (
                    <div key={feedback.id} className="bg-white rounded-md md:rounded-xl p-3 md:p-5 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">

                                <div className="flex items-start justify-between">

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">
                                                {feedback.user.name}
                                            </h3>
                                            <div
                                            className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold"
                                            style={{ backgroundColor: ratingColors.bg, color: ratingColors.color }}
                                            >
                                                <Star className="w-3.5 h-3.5" fill="currentColor" />
                                                {feedback.rating}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {feedback.user.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatToSmartDate(feedback.createdAt)}
                                            </span>
                                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted">
                                                {feedback.bookingId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 ml-4">
                                        <div className="items-center gap-1 hidden md:flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                key={i}
                                                className="w-5 h-5 text-amber-500"
                                                fill={i < feedback.rating ? '#F59E0B' : 'none'}
                                                />
                                            ))}
                                        </div>

                                        <Button className="hidden md:block" onClick={() => setViewId(feedback.id)} variant="outline">
                                            View Details
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {feedback.comment}
                                </p>

                                <Button className="visible md:hidden mt-2 w-full" onClick={() => setViewId(feedback.id)} variant="outline">
                                    View Details
                                </Button>    
                            </div>
                        </div>
                    </div>
                );
            })}

            {(feedbacks && feedbacks.length === 0) && (
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

            {meta && (
                <DataPagination 
                meta={meta}
                page={page}
                onPageChange={updatePage}
                />
            )}
        </div>
    )
}

export default FeedbackList