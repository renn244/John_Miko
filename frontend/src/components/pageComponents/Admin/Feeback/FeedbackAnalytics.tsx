import { useState } from "react";
import type { Interval } from "./Analytics/feedback-analytics.utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FeedbackAverageRatingOvertime from "./Analytics/FeedbackAverageRatingOvertime";
import FeedbackCountPerRatingChart from "./Analytics/FeedbackCountPerRatingChart";

const FeedbackAnalytics = () => {
    const [interval, setInterval] = useState<Interval>("week");

    return (
        <div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold">Analytics</h2>
					<p className="text-sm text-muted-foreground">
						Week = day of week, Month = day of month, Year = months
					</p>
				</div>

				<Select value={interval} onValueChange={(v) => setInterval(v as Interval)}>
					<SelectTrigger className="w-full sm:w-52">
						<SelectValue placeholder="Select interval" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="day">Day</SelectItem>
						<SelectItem value="week">Week</SelectItem>
						<SelectItem value="month">Month</SelectItem>
						<SelectItem value="year">Year</SelectItem>
					</SelectContent>
				</Select>
			</div>
            
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <FeedbackAverageRatingOvertime interval={interval} />
                </div>

                <div className="col-span-2 lg:col-span-1">
                    <FeedbackCountPerRatingChart interval={interval} />
                </div>
            </div>
        </div>
    )
}

export default FeedbackAnalytics