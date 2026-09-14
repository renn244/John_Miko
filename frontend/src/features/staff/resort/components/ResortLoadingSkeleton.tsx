const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

export const ResortListSkeleton = () => (
  <div className="space-y-3" role="status" aria-live="polite">
    <span className="sr-only">Loading resort records</span>
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
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-5 w-44" />
            </div>
            <SkeletonBlock className="h-7 w-20 rounded-full" />
          </div>
          <SkeletonBlock className="h-4 w-4/5" />
          <div className="flex justify-between gap-3 border-t pt-3">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-7 w-24 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ResortDetailSkeleton = () => (
  <div className="space-y-4" role="status" aria-live="polite">
    <span className="sr-only">Loading resort details</span>
    <SkeletonBlock className="h-11 w-32" />
    <div className="space-y-2">
      <SkeletonBlock className="h-8 w-40" />
      <SkeletonBlock className="h-4 w-48" />
    </div>
    <div className="relative overflow-hidden rounded-xl border bg-card p-4 pl-5 shadow-sm">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-muted"
      />
      <div className="space-y-3">
        <div className="flex justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-6 w-52" />
          </div>
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>
        <SkeletonBlock className="h-4 w-44" />
      </div>
    </div>
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <SkeletonBlock className="h-5 w-36" />
      <div className="mt-4 space-y-3">
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
      </div>
    </div>
  </div>
);
