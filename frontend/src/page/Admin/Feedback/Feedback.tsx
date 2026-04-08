import FeedbackFilter from "@/components/pageComponents/Admin/Feeback/FeedbackFilter";
import FeedbackList from "@/components/pageComponents/Admin/Feeback/FeedbackList";
import FeedbackStatistics from "@/components/pageComponents/Admin/Feeback/FeedbackStatistics";
import ViewFeedbackDialog from "@/components/pageComponents/Admin/Feeback/ViewFeedbackDialog";

const Feedback = () => {
    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Booking Management
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Manage and monitor all confirmed reservations
                    </p>
                </div>
            </div>

            <FeedbackStatistics />

            <FeedbackFilter />

            <FeedbackList />

            <ViewFeedbackDialog />
        </div>
    )
}

export default Feedback