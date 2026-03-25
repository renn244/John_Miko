import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAccommodationOptionsQuery } from "@/hooks/admin/accommodation.hook"
import { Search, X } from "lucide-react"

const BookingFilter = () => {

    const { data: options, isLoading } = useGetAccommodationOptionsQuery();

    return (
        <div className="bg-white p-4 rounded-xl border-2">
            <div className="flex flex-col md:flex-row gap-4">

                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                    className="pl-8"
                    placeholder="Search by guest name or booking ID..."
                    />
                </div>


                <div className="relative">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Accommodation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Accommodations</SelectLabel>
                                <SelectItem value="all">All Accommodations</SelectItem>
                                {isLoading ? (
                                    <SelectItem value="loading" disabled>
                                        <LoadingSpinner />
                                    </SelectItem>
                                ) : (
                                    options?.map((option) => (
                                        <SelectItem key={option.id} value={option.id}>
                                            {option.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Accommodation Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Accommodation Type</SelectLabel>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="room">Room</SelectItem>
                                <SelectItem value="cottage">Cottage</SelectItem>
                                <SelectItem value="eventhall">Event Hall</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Payment Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Payment Type</SelectLabel>
                                <SelectItem value="all">All Payment Types</SelectItem>
                                <SelectItem value="partial">50% Downpayment</SelectItem>
                                <SelectItem value="full">Full Payment</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="secondary">
                    <X className="w-4 h-4" />
                    Reset Filters
                </Button>

            </div>
        </div>
    )
}

export default BookingFilter