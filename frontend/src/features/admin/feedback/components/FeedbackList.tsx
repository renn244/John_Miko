import DataPagination from "@/components/common/DataPagination";
import FeedbackCard from "@/features/admin/feedback/components/FeedbackCard";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetFeedbacksQuery } from "@/features/admin/feedback/hooks/useAdminFeedback";
import { useFeedbackSearch } from "@/features/admin/feedback/hooks/useFeedbackSearch";
import { useFeedbackAdminStore } from "@/features/admin/feedback/store/feedbackAdmin.store";
import type { FeedbackWithUser } from "@/features/shared/feedback/types/feedback.type";
import { format, isToday, isYesterday } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useMemo } from "react";

type FeedbackGroup = {
    label: string;
    items: FeedbackWithUser[];
}

const FeedbackGroupSection = ({
    group,
    onView,
}: {
    group: FeedbackGroup;
    onView: (id: string) => void;
}) => (
    <section className="space-y-3">
        <div className="flex items-center gap-3">
            <div className="flex shrink-0 items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{group.label}</h2>
                <span className="text-sm text-muted-foreground">
                    {group.items.length} {group.items.length === 1 ? "review" : "reviews"}
                </span>
            </div>
            <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.items.map((feedback) => (
                <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    onView={() => onView(feedback.id)}
                />
            ))}
        </div>
    </section>
);

const FeedbackList = () => {
    const setViewId = useFeedbackAdminStore((state) => state.setViewId);
    const { search, page, limit, updatePage } = useFeedbackSearch();

    const { data, isLoading, isError, refetch, isRefetching } = useGetFeedbacksQuery({
        page, limit, search
    });

    const feedbacks = data?.data ?? [];
    const meta = data?.meta;

    const groupedFeedbacks = useMemo<FeedbackGroup[]>(() => {
        const groups = new Map<string, FeedbackWithUser[]>();

        feedbacks.forEach((feedback) => {
            const label = getFeedbackGroupLabel(feedback.createdAt);
            const current = groups.get(label) ?? [];

            current.push(feedback);
            groups.set(label, current);
        });

        return Array.from(groups.entries()).map(([label, items]) => ({
            label,
            items,
        }));
    }, [feedbacks]);

    if(isLoading) {
        return (
            <div className="flex h-64 items-center justify-center px-5 py-6">
                <LoadingSpinner className="size-10" />
            </div>
        )
    }

    if(isError) {
        return (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                <MessageSquare className="size-12 text-muted-foreground/50" />
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Unable to load feedback</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try refreshing the list and loading the reviews again.
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
                    Retry
                </Button>
            </div>
        )
    }

    return (
        feedbacks.length === 0 ? (
            <div className="rounded-xl border border-dashed px-6 py-12 text-center">
                <MessageSquare className="mx-auto mb-4 size-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold text-foreground">No feedback found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your search to find matching reviews.
                </p>
            </div>
        ) : (
            <div className="space-y-6">
                {groupedFeedbacks.map((group) => (
                    <FeedbackGroupSection
                        key={group.label}
                        group={group}
                        onView={setViewId}
                    />
                ))}

                {meta ? (
                    <div className="pt-4">
                        <DataPagination 
                        meta={meta}
                        page={page}
                        onPageChange={updatePage}
                        />
                    </div>
                ) : null}
            </div>
        )
    )
}

const getFeedbackGroupLabel = (value: string) => {
    const createdAt = new Date(value);

    switch (true) {
        case isToday(createdAt):
            return "Today";
        case isYesterday(createdAt):
            return "Yesterday";
        default:
            return format(createdAt, "MMMM d, yyyy");
    }
}

export default FeedbackList
