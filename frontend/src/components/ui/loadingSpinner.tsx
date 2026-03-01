import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type LoadingSpinnerProps = {
    className?: string;
} & ComponentProps<"div">; 

const LoadingSpinner = ({
    className,
    ...props
}: LoadingSpinnerProps) => {
    return (
        <div {...props} className="flex items-center justify-center">
            <svg className={cn("spinner", className)} width="60" height="60" viewBox="0 0 44 44">
                <circle className="path" cx="22" cy="22" r="20" fill="none" stroke-width="4" stroke="currentColor"></circle>
            </svg>
        </div>
    )
}

export default LoadingSpinner