import { Calendar, DollarSign, Home, Users, Wrench } from "lucide-react"

const Statistics = () => {
    const stats = {
        currentlyOccupied: 17,
        totalGuests: 68,
        newBookingsToday: 12,
        revenueCollected: 125400,
        newMaintenanceToday: 5,
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

            <StatCard
            label="Currently Occupied"
            value={stats.currentlyOccupied}
            icon={Home}
            color="bg-blue-500 text-blue-500"
            />

            <StatCard
            label="Total Guests Count"
            value={stats.totalGuests}
            icon={Users}
            color="bg-emerald-500 text-emerald-500"
            />

            <StatCard
            label="New Bookings Today"
            value={stats.newBookingsToday}
            icon={Calendar}
            color="bg-purple-500 text-purple-500"
            />

            <StatCard
            label="Revenue Collected"
            value={stats.revenueCollected}
            icon={DollarSign}
            color="bg-amber-500 text-amber-500"
            format={(v: number) => `₱${v.toLocaleString()}`}
            />

            <StatCard
            label="New Maintenance Today"
            value={stats.newMaintenanceToday}
            icon={Wrench}
            color="bg-red-500 text-red-500"
            />

        </div>
    )
}

type StatCardProps = {
    label: string
    value: number
    icon: React.ElementType
    color: string
    format?: (value: number) => string
}

const StatCard = ({ label, value, icon: Icon, color, format }: StatCardProps) => {
    const [bg, text] = color.split(" ")

    return (
        <div className="rounded-xl p-5 border-2 shadow-lg hover:shadow-xl transition-all bg-white">
            <div className="flex justify-between mb-3">
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-md ${bg}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            <h3 className="text-2xl font-bold">
                {format ? format(value) : value}
            </h3>

            <p className={`text-sm font-medium ${text}`}>
                {label}
            </p>
        </div>
    )
}

export default Statistics