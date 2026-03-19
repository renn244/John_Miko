import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Accommodation } from "@/types/admin/accommodation.type"
import { CheckCircle, Edit, Info, MoreVertical, Tag, Users, XCircle } from "lucide-react"
import { Link } from "react-router"

type AccommodationCardProps = {
    id: Accommodation['id']
    imageUrl: Accommodation['imageUrl']
    name: Accommodation['name']
    description: Accommodation['description']
    type: Accommodation['type']
    availability: Accommodation['availability']
    capacity: Accommodation['capacity']
    price: Accommodation['price']
    amenities: Accommodation['amenities']
}

const AccommodationCard = (accommodation: AccommodationCardProps) => {
  const getAvailabilityConfig = (status: Accommodation['availability']) => {
    const configs = {
      'Available': {
        label: 'Available',
        color: '#0E9F6E',
        bg: '#DEF7EC',
        icon: CheckCircle,
      },
      'Unavailable': {
        label: 'Unavailable',
        color: '#DC2626',
        bg: '#FEE2E2',
        icon: XCircle,
      },
      'Maintenance': {
        label: 'Maintenance',
        color: '#D97706',
        bg: '#FEF3C7',
        icon: Info,
      },
    };

    return configs[status];
  };

  const availabilityConfig = getAvailabilityConfig(accommodation.availability);
  const AvailabilityIcon = availabilityConfig.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition-all">
        <div className="relative h-48 bg-gray-200 overflow-hidden">

            <img
            src={accommodation.imageUrl}
            alt={accommodation.name}
            className="w-full h-full object-cover"
            />

            <Badge className="absolute top-3 left-3 capitalize z-99">
                {accommodation.type}
            </Badge>

            <Badge className={`absolute top-3 right-3 z-99 bg-[${availabilityConfig.bg}] text-${availabilityConfig.color}`}>
                <AvailabilityIcon className="w-3 h-3" />
                {availabilityConfig.label}
            </Badge>

        </div>

        <div className="p-4">

            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">
                        {accommodation.name}
                    </h3>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost'>
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <Link to={`/admin/accommodation/${accommodation.id}/edit`}>
                            <DropdownMenuItem>
                                <Edit />
                                Edit Details
                            </DropdownMenuItem>  
                        </Link>              
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Change Availability</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Set Available
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <XCircle className="w-4 h-4 text-red-600" />
                                Set Unavailable
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Info className="w-4 h-4 text-yellow-600" />
                                Set in Maintenance
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            <p className="text-sm mb-4 line-clamp-2 text-muted-foreground">
                {accommodation.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                        {accommodation.capacity} pax
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                        ₱{accommodation.price.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="border-t pt-3">
                <div className="flex flex-wrap gap-1">
                    {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                        key={index}
                        className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground"
                        >
                            {amenity}
                        </span>
                    ))}
                    {accommodation.amenities.length > 3 && (
                        <span
                        className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600"
                        >
                            +{accommodation.amenities.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AccommodationCard;