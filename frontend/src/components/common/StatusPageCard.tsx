import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type StatusPageAction = {
    label: string;
    to: string;
    variant?: "default" | "outline" | "secondary";
};

type StatusPageCardProps = {
    title: string;
    message: string;
    code?: string;
    actions?: StatusPageAction[];
    className?: string;
};

const StatusPageCard = ({
    title,
    message,
    code,
    actions = [],
    className,
}: StatusPageCardProps) => {
    return (
        <div
            className={cn(
                "relative w-full max-w-3xl px-6 py-12 text-center md:px-10 md:py-16",
                className,
            )}
        >
            <div className="relative">
                {code ? (
                    <div className="pointer-events-none select-none bg-gradient-to-b from-primary via-primary/85 to-primary/55 bg-clip-text text-[5rem] font-black leading-none tracking-[-0.08em] text-transparent md:text-[8rem]">
                        {code}
                    </div>
                ) : null}

                <div className={cn("mx-auto", code ? "mt-6 md:mt-8" : "")}>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                        {title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                        {message}
                    </p>

                    {actions.length ? (
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            {actions.map((action) => (
                                <Button
                                    key={`${action.to}-${action.label}`}
                                    asChild
                                    size="lg"
                                    variant={action.variant ?? "default"}
                                    className="min-w-40"
                                >
                                    <Link to={action.to}>{action.label}</Link>
                                </Button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default StatusPageCard;
