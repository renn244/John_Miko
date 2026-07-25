const AdminEditPageLoading = () => (
    <div className="mx-auto w-full max-w-7xl space-y-6" role="status" aria-live="polite">
        <span className="sr-only">Loading editor</span>
        <div className="flex items-center gap-4">
            <div className="size-9 animate-pulse rounded-md border bg-muted" />
            <div className="space-y-2">
                <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-80 max-w-[70vw] animate-pulse rounded-md bg-muted/70" />
            </div>
        </div>
        <div className="min-h-120 animate-pulse rounded-xl border bg-card/70" />
    </div>
);

export default AdminEditPageLoading;
