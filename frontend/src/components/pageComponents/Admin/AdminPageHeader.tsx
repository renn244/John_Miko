import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

const AdminPageHeader = ({
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) => (
  <header
    className={cn(
      "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      className,
    )}
  >
    <div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>

    {actions ? (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center [&>[data-slot=button]]:w-full sm:[&>[data-slot=button]]:w-auto">
        {actions}
      </div>
    ) : null}
  </header>
);

export default AdminPageHeader;
