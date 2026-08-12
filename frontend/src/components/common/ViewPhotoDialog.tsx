import { useState, type ComponentProps, type PropsWithChildren } from "react"
import { X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog"
import { cn } from "@/lib/utils"

type ViewPhotoDialogProps= { 
    className?: string,
    imageUrl: string,
    imgOptions?: ComponentProps<"img">
} & PropsWithChildren

const ViewPhotoDialog = ({ children, className, imageUrl, imgOptions }: ViewPhotoDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const { className: imgClassName, ...restImgOptions } = imgOptions || {}

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={cn("w-auto max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none", className)} showCloseButton={false}>
                <DialogClose className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close photo preview">
                    <X className="size-5" />
                </DialogClose>
                <div className="overflow-hidden rounded-lg bg-black">
                    <img 
                    src={imageUrl}
                    className={cn("w-full h-auto max-h-[85vh] object-contain", imgClassName)}
                    {...restImgOptions}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewPhotoDialog
