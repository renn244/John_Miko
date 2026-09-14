import FeedbackFilter from "@/features/admin/feedback/components/FeedbackFilter";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import FeedbackList from "@/features/admin/feedback/components/FeedbackList";
import FeedbackStatistics from "@/features/admin/feedback/components/FeedbackStatistics";
import ViewFeedbackDialog from "@/features/admin/feedback/components/ViewFeedbackDialog";

const Feedback = () => {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Guest Feedback"
        description="View and manage guest reviews and ratings"
      />
      <FeedbackStatistics />
      <FeedbackFilter />
      <FeedbackList />

      <ViewFeedbackDialog />
    </div>
  );
};

export default Feedback;
