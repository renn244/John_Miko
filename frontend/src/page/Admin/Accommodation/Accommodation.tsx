import AccommodationCard from "@/components/pageComponents/Admin/Accommodation/AccommodationCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Home, Info, Plus, Search, XCircle } from "lucide-react"
import { Link } from "react-router"

const Accommodation = () => {
  const stats = {
    total: 120,
    available: 85,
    unavailable: 25,
    maintenance: 10,
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Accommodation Management
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Manage rooms, cottages, and event halls
          </p>
        </div>
        <Link to="/admin/accommodation/add">
          <Button>
            Add Accommodation
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total
            </span>
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">
            {stats.total}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Available
            </span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {stats.available}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Unavailable
            </span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {stats.unavailable}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Maintenance
            </span>
            <Info className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.maintenance}
          </p>
        </div>
      
      </div>

      <div className="bg-white p-4 rounded-xl border-2">
        <div className="flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
            className="w-full pl-10 pr-4"
            placeholder="Search Accommodations..."
            />
          </div>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Types</SelectLabel>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rooms">Rooms</SelectItem>
                <SelectItem value="cottages">Cottages</SelectItem>
                <SelectItem value="event-halls">Event Halls</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AccommodationCard
        id="sdad"
        imageUrl="https://images.unsplash.com/photo-1761850648640-2ee5870ee883?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        name="Sample Accommodation"
        description="A beautiful accommodation for your stay."
        type="room"
        availability="unavailable"
        capacity={4}
        price={100}
        amenities={['WiFi', 'Parking', 'Gym', 'Bedroom']}
        />
      </div>
    </div>
  )
}

export default Accommodation