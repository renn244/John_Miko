import { useState, type ComponentProps, type PropsWithChildren } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
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
            <DialogContent className={cn("p-3 w-auto", className)}>
                <div>
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