import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
  backTo?: string;
  backLabel?: string;
};

const AdminPageHeader = ({
  title,
  description,
  actions,
  className,
  backTo,
  backLabel = "Back",
}: AdminPageHeaderProps) => (
  <header
    className={cn(
      "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      className,
    )}
  >
    <div className="flex min-w-0 items-start gap-3">
      {backTo ? (
        <Button
          asChild
          size="icon"
          variant="outline"
          className="mt-0.5 shrink-0"
          aria-label={backLabel}
        >
          <Link to={backTo}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      ) : null}

      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 break-words text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>

    {actions ? (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center [&>[data-slot=button]]:w-full sm:[&>[data-slot=button]]:w-auto">
        {actions}
      </div>
    ) : null}
  </header>
);

export default AdminPageHeader;
