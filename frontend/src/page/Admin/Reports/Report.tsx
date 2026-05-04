import AccommodationBreakdown from "@/components/pageComponents/Admin/Reports/AccommodationBreakdown"
import GuestFeedback from "@/components/pageComponents/Admin/Reports/GuestFeedback"
import MaintenanceTickets from "@/components/pageComponents/Admin/Reports/MaintenanceTickets"
import RevenueBreakdown from "@/components/pageComponents/Admin/Reports/RevenueBreakdown"
import Statistics from "@/components/pageComponents/Admin/Reports/Statistics"

const Report = () => {
    return (
        <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Reports
                    </h1>
                    <p className="text-sm mt-1 text-muted-foreground">
                        Comprehensive insights and performance metrics
                    </p>
                </div>
            </div>

           {/* <Statistics /> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueBreakdown />

                <AccommodationBreakdown />

                <MaintenanceTickets />

                <GuestFeedback />                
            </div>

        </div>
    )
}

export default Report