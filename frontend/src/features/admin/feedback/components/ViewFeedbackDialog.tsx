import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import NotFoundDialog from "@/components/common/dialog/NotFoundDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useGetFeedbackByIdQuery } from "@/features/admin/feedback/hooks/useAdminFeedback";
import { cn } from "@/lib/utils";
import { useFeedbackAdminStore } from "@/features/admin/feedback/store/feedbackAdmin.store";
import type { FeedbackWithUser } from "@/features/shared/feedback/types/feedback.type";
import { format } from "date-fns";
import { Calendar, Hash, Mail, Star, X } from "lucide-react";

const ViewFeedbackDialog = () => {
    const isViewOpen = useFeedbackAdminStore((state) => state.isViewOpen);
    const viewFeedbackId = useFeedbackAdminStore((state) => state.viewId);
    const setIsViewOpen = useFeedbackAdminStore((state) => state.setIsViewOpen);
    const setViewFeedbackId = useFeedbackAdminStore((state) => state.setViewId);

    const { data, isLoading, error, refetch, isRefetching } = useGetFeedbackByIdQuery(viewFeedbackId);

    return (
        <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
            <SheetContent
            side="right"
            showCloseButton={false}
            className="flex h-full w-full gap-0 overflow-hidden p-0 sm:max-w-[460px]"
            onCloseAutoFocus={() => setViewFeedbackId(undefined)}
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Feedback Details</SheetTitle>
                    <SheetDescription>View the selected guest feedback details.</SheetDescription>
                </SheetHeader>

                {isLoading && (
                    <div className="flex flex-1 items-center justify-center px-6">
                        <LoadingSpinner className="size-10" />
                    </div>
                )}

                {error && (
                    <div className="flex flex-1 items-center justify-center px-6">
                        <ErrorDialog
                        onBack={() => setIsViewOpen(false)}
                        onRetry={refetch}
                        retryLoading={isRefetching}
                        />
                    </div>
                )}

                {!data && !isLoading && !error && isViewOpen && (
                    <div className="flex flex-1 items-center justify-center px-6">
                        <NotFoundDialog
                        onBack={() => setIsViewOpen(false)}
                        onRetry={refetch}
                        retryLoading={isRefetching}
                        title="Feedback Not Found"
                        />
                    </div>
                )}

                {data ? <FeedbackDetails feedback={data} /> : null}
            </SheetContent>
        </Sheet>
    );
};

const FeedbackDetails = ({ feedback }: { feedback: FeedbackWithUser }) => {
    const setIsViewOpen = useFeedbackAdminStore((state) => state.setIsViewOpen);
    const tone = getFeedbackTone(feedback.rating);

    return (
        <>
            <div className={cn("border-b px-5 py-5", tone.headerClass)}>
                <div className="flex items-start justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        Feedback Details
                    </p>

                    <SheetClose asChild>
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Close feedback details"
                        className="rounded-full text-white/80 hover:bg-white/15 hover:text-white"
                        >
                            <X className="size-4" />
                        </Button>
                    </SheetClose>
                </div>

                <div className="mt-4 flex items-center gap-4">
                    <Avatar size="lg" className="size-14">
                        <AvatarFallback className="bg-primary text-xl font-semibold text-white">
                            {feedback.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold tracking-tight text-white">
                            {feedback.user.name}
                        </h2>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                    key={`${feedback.id}-detail-star-${index}`}
                                    className={cn(
                                        "size-4",
                                        index < feedback.rating ? "text-yellow-300" : "text-white/35",
                                    )}
                                    fill={index < feedback.rating ? "currentColor" : "none"}
                                    />
                                ))}
                            </div>

                            <span className="text-sm font-semibold text-white">
                                {feedback.rating.toFixed(1)}
                            </span>
                            <span className="text-sm font-medium text-white">
                                {tone.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-5">
                    <section className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Guest Contact
                        </p>
                        <div className="mt-2 flex items-start gap-2 text-sm text-foreground">
                            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="break-all">{feedback.user.email}</span>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Booking Reference
                        </p>
                        <div className="mt-2 flex items-start gap-2 text-sm text-foreground">
                            <Hash className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="break-all font-medium text-primary">
                                {feedback.booking?.referenceCode ?? "Not available"}
                            </span>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Full Comment
                        </p>
                        <div className={cn("rounded-xl border px-4 py-4", tone.commentClass)}>
                            <p className="text-sm leading-7 text-foreground/90">
                                {feedback.comment || "No written comment provided."}
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Submitted On
                            </p>
                            <div className="mt-2 flex items-start gap-2 text-sm text-foreground">
                                <Calendar className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span>
                                    {format(new Date(feedback.createdAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Feedback ID
                            </p>
                            <p className="mt-2 break-all text-sm text-muted-foreground">
                                {feedback.id}
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            <div className="border-t px-5 py-4">
                <Button variant="outline" className="w-full" onClick={() => setIsViewOpen(false)}>
                    Close
                </Button>
            </div>
        </>
    );
};

const getFeedbackTone = (rating: number) => {
    if (rating >= 5) {
        return {
            label: "Excellent",
            headerClass: "bg-emerald-500",
            commentClass: "border-emerald-200/80 bg-emerald-50/70",
        };
    }

    if (rating >= 4) {
        return {
            label: "Great",
            headerClass: "bg-lime-500",
            commentClass: "border-lime-200/80 bg-lime-50/70",
        };
    }

    if (rating >= 3) {
        return {
            label: "Okay",
            headerClass: "bg-amber-500",
            commentClass: "border-amber-200/80 bg-amber-50/70",
        };
    }

    return {
        label: "Needs Attention",
        headerClass: "bg-rose-500",
        commentClass: "border-rose-200/80 bg-rose-50/70",
    };
};

export default ViewFeedbackDialog;
