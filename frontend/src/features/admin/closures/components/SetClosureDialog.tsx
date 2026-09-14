import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClosureForm from "@/features/admin/closures/forms/ClosureForm";
import DeleteClosureForm from "@/features/admin/closures/forms/DeleteClosureForm";
import { useCreateClosureMutation, useDeleteClosureMutation } from "@/features/admin/closures/hooks/useClosureAdmin";
import { toDateOnly } from "@/lib/date.util";
import { useClosureAdminStore } from "@/features/admin/closures/store/closureAdmin.store";
import type { ClosureScope } from "@/features/shared/closures/types/closure.type";
import { Lock, Plus } from "lucide-react";

const SetClosureDialog = () => {

    const isOpen = useClosureAdminStore((s) => (s.isClosureOpen));
    const setOpen = useClosureAdminStore((s) => (s.setClosureOpen));
    const accommodation = useClosureAdminStore((s) => s.accommodation);

    const scope: ClosureScope = accommodation ? "accommodation" : "resort";
    const titleSubtitle = scope === "resort" ? "Entire Resort" : accommodation?.name ?? "Accommodation";

    const { mutateAsync: createClosure } = useCreateClosureMutation(accommodation?.id);
    const { mutateAsync: deleteClosure } = useDeleteClosureMutation(accommodation?.id);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if(!open) {
                setOpen(false)
            }   
        }}>
            <DialogContent
            className="sm:max-w-md"
            onCloseAutoFocus={() => setOpen(false, null)}
            >
                <Tabs defaultValue="create" className="space-y-5 gap-0">
                    <DialogHeader className="space-y-2">
                        <div className="flex items-start gap-3">
                            <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                                <Lock className="size-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <DialogTitle>Set Closure</DialogTitle>
                                <DialogDescription>{titleSubtitle}</DialogDescription>
                            </div>
                        </div>
                        <TabsList className="w-full">
                            <TabsTrigger value="create">
                                <Plus className="size-4" />
                                Create
                            </TabsTrigger>
                            <TabsTrigger value="delete">
                                <Lock className="size-4" />
                                Delete
                            </TabsTrigger>
                        </TabsList>
                    </DialogHeader>

                    {/* Create Closure Form */}
                    <TabsContent value="create" className="transition-all duration-300 ease-in-out">
                        <ClosureForm 
                        onsubmit={async (data) => {
                            await createClosure({
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
                    </TabsContent>
                    
                    {/* Delete Closure Form */}
                    <TabsContent value="delete" className="transition-all duration-300 ease-in-out">
                        <DeleteClosureForm 
                        onsubmit={async (closureId) => {
                            await deleteClosure(closureId)
                            setOpen(false);
                            return
                        }}
                        oncancel={() => setOpen(false)}
                        className={`max-w-3xl`}
                        accommodationId={accommodation?.id}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default SetClosureDialog;
