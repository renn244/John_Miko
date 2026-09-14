const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

export const KitchenQueueSkeleton = () => (
  <div className="space-y-3" role="status" aria-live="polite">
    <span className="sr-only">Loading pre-orders</span>
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="relative overflow-hidden rounded-xl border bg-card p-4 pl-5 shadow-sm"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-muted"
        />
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-44" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
            <SkeletonBlock className="h-7 w-20 rounded-full" />
          </div>
          <div className="flex gap-4">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-14" />
          </div>
          <SkeletonBlock className="h-9 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const KitchenOrderDetailSkeleton = () => (
  <div className="space-y-4" role="status" aria-live="polite">
    <span className="sr-only">Loading kitchen order</span>
    <SkeletonBlock className="h-11 w-28" />
    <div className="space-y-2">
      <SkeletonBlock className="h-8 w-40" />
      <SkeletonBlock className="h-4 w-52" />
    </div>
    <div className="relative overflow-hidden rounded-xl border bg-card p-4 pl-5 shadow-sm">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-muted"
      />
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-6 w-48" />
            <SkeletonBlock className="h-4 w-36" />
          </div>
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>
        <SkeletonBlock className="h-4 w-52" />
      </div>
    </div>
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-24" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <SkeletonBlock className="h-9 w-28" />
      </div>
      <div className="mt-4 space-y-3">
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
      </div>
    </div>
  </div>
);
