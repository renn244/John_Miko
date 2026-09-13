import type { MouseEventHandler, ReactNode } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminFilterLayoutProps = {
  search: ReactNode;
  children: ReactNode;
  className?: string;
};

export const AdminFilterLayout = ({
  search,
  children,
  className,
}: AdminFilterLayoutProps) => (
  <div
    className={[
      "flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <div className="min-w-0 w-full xl:max-w-xl xl:flex-1">{search}</div>
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:ml-4 xl:flex-nowrap xl:justify-end xl:gap-2">
      {children}
    </div>
  </div>
);

type AdminClearFiltersButtonProps = {
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const AdminClearFiltersButton = ({
  disabled = false,
  onClick,
}: AdminClearFiltersButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    onClick={onClick}
    disabled={disabled}
    className="w-full justify-start whitespace-nowrap text-primary hover:bg-accent hover:text-primary sm:w-auto disabled:pointer-events-none"
  >
    <X className="size-4" />
    Clear Filters
  </Button>
);
