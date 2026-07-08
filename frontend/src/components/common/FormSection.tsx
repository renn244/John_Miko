import type { ComponentProps, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

type FormSectionProps = {
    title: string;
    contentClassName?: string;
} & PropsWithChildren & ComponentProps<typeof Card>;

const FormSection = ({ title, children, className, contentClassName, ...cardProps }: FormSectionProps) => {
    return (
        <Card className={cn("gap-0 py-0", className)} {...cardProps}>
            <div className="mx-5 border-b border-border pb-2.5 pt-5">
                <h2 className="text-lg font-bold">
                    {title}
                </h2>
            </div>

            <CardContent className={cn("px-5 py-5", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    )
}

export default FormSection
