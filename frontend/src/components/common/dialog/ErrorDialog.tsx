import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

type ErrorDialogProps = {
    title?: string;
    message?: string;
    customActions?: React.ReactNode;
    className?: string;

    onBack: () => void;
    backLoading?: boolean;

    onRetry?: () => void;
    retryLoading?: boolean;
}

const ErrorDialog = ({
    title = "An Error Occurred",
    message = "Something went wrong while fetching the data",
    customActions,
    className,
    onBack,
    backLoading = false,
    onRetry,
    retryLoading = false,
    ...props
}: ErrorDialogProps) => {
    return (
        <div className={cn("p-2 text-center w-full max-w-md mx-auto", className)} {...props}>
            <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-red-600 mb-1.5">{title}</h2>
            <p className="text-gray-600 mb-5 leading-relaxed text-sm">{message}</p>

            <div className="space-y-1.5">
                {customActions ? (
                    customActions
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {onBack && (
                            <Button variant="outline" disabled={backLoading} onClick={onBack} className="text-gray-700 bg-transparent">
                                {backLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <ArrowLeft className="w-4 h-4" />
                                        Go Back
                                    </>
                                )}
                            </Button>
                        )}
                    
                        <Button disabled={retryLoading} onClick={onRetry} className="w-full bg-blue-600 hover:bg-blue-700">
                            {retryLoading ? (
                                <>
                                    <LoadingSpinner />
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ErrorDialog