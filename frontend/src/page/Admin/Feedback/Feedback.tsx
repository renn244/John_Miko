import FeedbackAnalytics from "@/components/pageComponents/Admin/Feeback/FeedbackAnalytics.tsx";
import FeedbackFilter from "@/components/pageComponents/Admin/Feeback/FeedbackFilter";
import FeedbackList from "@/components/pageComponents/Admin/Feeback/FeedbackList";
import FeedbackStatistics from "@/components/pageComponents/Admin/Feeback/FeedbackStatistics";
import ViewFeedbackDialog from "@/components/pageComponents/Admin/Feeback/ViewFeedbackDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Feedback = () => {
    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Guest Feedback
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        View and manage guest reviews and ratings
                    </p>
                </div>
            </div>

            <Tabs defaultValue="feedback">
                <TabsList>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="feedback" className="space-y-6">
                    <FeedbackStatistics />
                    <FeedbackFilter />
                    <FeedbackList />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <FeedbackAnalytics />
                </TabsContent>
            </Tabs>

            <ViewFeedbackDialog />
        </div>
    )
}

export default Feedback