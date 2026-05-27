import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClosureForm from "@/forms/Admin/Closure/ClosureForm";
import { useCreateClosureMutation } from "@/hooks/admin/closure.hook";
import { toDateOnly } from "@/lib/date.util";
import { useClosureAdminStore } from "@/store/admin/closureAdmin.store";
import type { ClosureScope } from "@/types/admin/closure.type";
import { Lock } from "lucide-react";

const SetClosureDialog = () => {
    const isOpen = useClosureAdminStore((s) => (s.isClosureOpen));
    const setOpen = useClosureAdminStore((s) => (s.setClosureOpen));
    const accommodation = useClosureAdminStore((s) => s.accommodation);

    const scope: ClosureScope = accommodation ? "accommodation" : "resort";
    const titleSubtitle = scope === "resort" ? "Entire Resort" : accommodation?.name ?? "Accommodation";

    const { mutateAsync } = useCreateClosureMutation(accommodation?.id);
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if(!open) {
                setOpen(false, null)
            }   
        }}>
            <DialogContent className="sm:max-w-md">
                <div className="space-y-5">
                    <DialogHeader className="space-y-0">
                        <div className="flex items-start gap-3">
                            <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                                <Lock className="size-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle>Set Closure</DialogTitle>
                                <DialogDescription>{titleSubtitle}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <ClosureForm 
                    onsubmit={async (data) => {
                        await mutateAsync({
                            accommodationId: accommodation?.id,
                            date: toDateOnly(data.date),
                            type: data.type,
                            reason: data.reason
                        });
                        setOpen(false)
                        return
                    }}
                    oncancel={() => setOpen(false)}
                    className={'max-w-3xl'}
                    accommodationId={accommodation?.id}
                    scope={scope}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SetClosureDialog;
