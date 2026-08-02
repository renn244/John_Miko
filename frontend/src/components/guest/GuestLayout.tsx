import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const guestLayout = {
  page: "flex min-h-screen flex-col bg-muted/30 text-foreground",
  container: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
  pageGap: "py-6 md:py-8",
  sectionGap: "py-8 md:py-10",
  sectionGapCompact: "py-6 md:py-8",
  card: "rounded-xl border bg-card text-card-foreground shadow-sm",
  cardPadding: "p-4 md:p-6",
  accentBorder: "border-l-4 border-l-primary",
  hairline: "border-border/80",
};

type DivProps = ComponentProps<"div">;

type HeaderProps = DivProps & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

type SectionProps = DivProps & {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
};

type CardProps = DivProps & {
  accent?: boolean;
  padded?: boolean;
};

type ChipProps = ComponentProps<"span"> & {
  active?: boolean;
};

export function GuestPageShell({ className, ...props }: DivProps) {
  return <main className={cn(guestLayout.page, className)} {...props} />;
}

export function GuestContainer({ className, ...props }: DivProps) {
  return <div className={cn(guestLayout.container, className)} {...props} />;
}

export function GuestPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  ...props
}: HeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-6 md:flex-row md:items-end md:justify-between md:py-8",
        className
      )}
      {...props}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-normal text-foreground md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function GuestSection({
  eyebrow,
  title,
  description,
  actions,
  compact,
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || title || description || actions;

  return (
    <section
      className={cn(compact ? guestLayout.sectionGapCompact : guestLayout.sectionGap, className)}
      {...props}
    >
      {hasHeader ? (
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:justify-between">
          <div>
            {eyebrow ? (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-2xl font-bold tracking-normal text-foreground md:text-3xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function GuestCard({
  accent = false,
  padded = true,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        guestLayout.card,
        padded && guestLayout.cardPadding,
        accent && guestLayout.accentBorder,
        className
      )}
      {...props}
    />
  );
}

export function GuestInfoChip({ active = false, className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium",
        active
          ? "bg-primary text-primary-foreground"
          : "border bg-background text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function GuestDivider({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("border-0 border-t", guestLayout.hairline, className)} {...props} />;
}
