import FeedbackFilter from "@/components/pageComponents/Admin/Feeback/FeedbackFilter";
import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import FeedbackList from "@/components/pageComponents/Admin/Feeback/FeedbackList";
import FeedbackStatistics from "@/components/pageComponents/Admin/Feeback/FeedbackStatistics";
import ViewFeedbackDialog from "@/components/pageComponents/Admin/Feeback/ViewFeedbackDialog";

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
