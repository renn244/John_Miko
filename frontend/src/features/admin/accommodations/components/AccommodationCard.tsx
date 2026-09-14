import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AdminDecisionNotice from "@/components/common/AdminDecisionNotice"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useClosureAdminStore } from "@/features/admin/closures/store/closureAdmin.store"
import { useRestoreAccommodationMutation, useRetireAccommodationMutation } from "@/features/admin/accommodations/hooks/useAccommodationAdmin"
import type { Accommodation } from "@/features/shared/accommodations/types/accommodation.type"
import { AlertTriangle, ArchiveRestore, Edit, Lock, MoreVertical, RotateCcw, Tag, Trash2, Users } from "lucide-react"
import { Link } from "react-router"
import { useState } from "react"
import { toast } from "sonner"

type AccommodationCardProps = {
    id: Accommodation['id']
    imageUrl: Accommodation['imageUrl']
    name: Accommodation['name']
    description: Accommodation['description']
    type: Accommodation['type']
    capacity: Accommodation['capacity']
    price: Accommodation['price']
    amenities: Accommodation['amenities']
    retiredAt?: Accommodation['retiredAt']
}

const AccommodationCard = (accommodation: AccommodationCardProps) => {
    const setClosureOpen = useClosureAdminStore((s) => s.setClosureOpen);
    const { mutateAsync: retire, isPending: isRetiring } = useRetireAccommodationMutation();
    const { mutateAsync: restore, isPending: isRestoring } = useRestoreAccommodationMutation();
    const isRetired = !!accommodation.retiredAt;
    const [isRetirementDialogOpen, setIsRetirementDialogOpen] = useState(false);

    const confirmRetirementChange = async () => {
        try {
            if (isRetired) {
                await restore(accommodation.id);
                toast.success(`${accommodation.name} restored`);
            } else {
                await retire(accommodation.id);
                toast.success(`${accommodation.name} retired`);
            }
            setIsRetirementDialogOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Unable to update accommodation');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition-all">
            <div className="relative h-48 bg-gray-200 overflow-hidden">

                <img
                src={accommodation.imageUrl}
                alt={accommodation.name}
                className="w-full h-full object-cover"
                />

                <Badge className="absolute top-3 left-3 capitalize z-20">
                    {accommodation.type}
                </Badge>
                {isRetired && <Badge variant="secondary" className="absolute right-3 top-3 z-20">Retired</Badge>}

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
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Actions for ${accommodation.name}`}
                            >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {!isRetired && <><DropdownMenuItem asChild>
                                <Link to={`/admin/accommodation/${accommodation.id}/edit`}><Edit />Edit Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                onClick={() =>
                                    setClosureOpen(true, {
                                        id: accommodation.id,
                                        name: accommodation.name,
                                    })
                                }
                                >
                                    <Lock className="w-4 h-4" />
                                    Set Closure
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator /></>}
                            <DropdownMenuItem
                              variant={isRetired ? "default" : "destructive"}
                              disabled={isRetiring || isRestoring}
                              onClick={() => setIsRetirementDialogOpen(true)}
                            >
                              {isRetired ? <ArchiveRestore className="size-4" /> : <Trash2 className="size-4" />}
                              {isRetired ? "Restore accommodation" : "Retire accommodation"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                <p className="text-sm mb-4 line-clamp-2 h-10 text-muted-foreground">
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

            <Dialog open={isRetirementDialogOpen} onOpenChange={setIsRetirementDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isRetired ? "Restore accommodation?" : "Retire accommodation?"}
                        </DialogTitle>
                        <DialogDescription>
                            {isRetired
                                ? `Restore ${accommodation.name} for public browsing and future bookings.`
                                : `Retire ${accommodation.name} from public browsing and future bookings.`}
                        </DialogDescription>
                    </DialogHeader>

                    <AdminDecisionNotice
                        tone={isRetired ? "success" : "warning"}
                        icon={isRetired ? RotateCcw : AlertTriangle}
                        title={isRetired ? "This accommodation will become available again." : "Existing records will be kept."}
                        description={
                            isRetired
                                ? "Guests will be able to view and book it again when it has availability."
                                : "Booking, payment, report, and feedback history remain available. Retirement is blocked while future pending or confirmed bookings exist."
                        }
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isRetiring || isRestoring}
                            onClick={() => setIsRetirementDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant={isRetired ? "success" : "destructive"}
                            disabled={isRetiring || isRestoring}
                            onClick={confirmRetirementChange}
                        >
                            {isRetiring || isRestoring ? (
                                <LoadingSpinner className="size-4" />
                            ) : (
                                <>
                                    {isRetired ? <ArchiveRestore className="size-4" /> : <Trash2 className="size-4" />}
                                    {isRetired ? "Restore accommodation" : "Retire accommodation"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AccommodationCard;
