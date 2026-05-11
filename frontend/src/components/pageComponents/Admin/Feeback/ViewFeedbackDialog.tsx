import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetFeedbackByIdQuery } from "@/hooks/admin/feedback.hook";
import { useFeedbackAdminStore } from "@/store/admin/feedbackAdmin.store";
import type { FeedbackWithUser } from "@/types/feedback.types";
import { format } from "date-fns";
import { Calendar, Hash, Mail, Star } from "lucide-react";

const ViewFeedbackDialog = () => {
    const isViewOpen = useFeedbackAdminStore((state) => state.isViewOpen);
    const viewFeedbackId = useFeedbackAdminStore((state) => state.viewId);
    const setIsViewOpen = useFeedbackAdminStore((state) => state.setIsViewOpen);
    
    const { data, isLoading, error, refetch, isRefetching } = useGetFeedbackByIdQuery(viewFeedbackId);

    return (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="sm:max-w-xl">
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}
                {error && (
                    <ErrorDialog 
                    onBack={() => setIsViewOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    />
                )}
                {(!data && !isLoading && !error && isViewOpen) && (
                    <NotFoundDialog 
                    onBack={() => setIsViewOpen(false)}
                    onRetry={refetch} retryLoading={isRefetching}
                    title="Feedback Not Found"
                    />
                )}

                {data && <FeedbackDetails feedback={data} />}
            </DialogContent>
        </Dialog>
    )
}

const FeedbackDetails = ({ feedback }: { feedback: FeedbackWithUser }) => {
    const setIsViewOpen = useFeedbackAdminStore((state) => state.setIsViewOpen);
    
    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Feedback Details
                </DialogTitle>
                <DialogDescription>
                    Reference: {feedback.id}
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">    

                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Guest Information
                    </h3>

                    <div className="bg-gray-50 rounded-xl p-2 md:p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Avatar size="lg">
                                <AvatarFallback className="bg-primary text-white">
                                    {feedback.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">
                                    {feedback.user.name}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {feedback.user.email}
                                </div>
                            </div>
                        </div>
                        
                        {feedback.bookingId && (
                            <div className="flex items-center gap-2 text-sm pt-2 border-t">
                                <Hash className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Booking Reference:</span>
                                <span className=" font-semibold text-primary">
                                    {feedback.bookingId}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
                        Feedback Details
                    </h3>

                    <div className="space-y-4">

                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">
                                Rating
                            </Label>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                    key={i}
                                    className="w-6 h-6"
                                    fill={i < feedback.rating ? '#F59E0B' : 'none'}
                                    style={{ color: '#F59E0B' }}
                                    />
                                ))}
                                <span className="ml-2 font-bold text-lg">
                                    {feedback.rating} / 5
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">
                                Full Comment
                            </Label>
                            <div className="p-4 rounded-lg border bg-muted">
                                <p className="text-sm leading-relaxed text-foreground">
                                    {feedback.comment}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">
                                Submitted On
                            </Label>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{format(feedback.createdAt, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                        Close
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ViewFeedbackDialog