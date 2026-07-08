import type { PaginationMeta } from "@/types/pagination.type";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";

type PaginationFallback = {
    total?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
};

type DataPaginationProps = {
    meta?: PaginationMeta | null;
    page: number;
    onPageChange: (page: number) => void;
    showSinglePageControls?: boolean;
    fallbackMeta?: PaginationFallback;
    summaryLabel?: string;
};

const DataPagination = ({
    meta,
    page,
    onPageChange,
    showSinglePageControls = false,
    fallbackMeta,
    summaryLabel = "entries",
}: DataPaginationProps) => {
    const fallbackTotal = fallbackMeta?.total ?? 0;
    const fallbackLimit = fallbackMeta?.limit ?? Math.max(fallbackTotal, 1);
    const fallbackTotalPages = fallbackMeta?.totalPages ?? Math.max(1, Math.ceil(fallbackTotal / fallbackLimit));

    const resolvedMeta = meta ?? (fallbackMeta ? {
        total: fallbackTotal,
        page,
        limit: fallbackLimit,
        totalPages: fallbackTotalPages,
        hasNextPage: fallbackMeta.hasNextPage ?? page < fallbackTotalPages,
        hasPrevPage: fallbackMeta.hasPrevPage ?? page > 1,
    } : null);

    if (!resolvedMeta) return null;
    if (resolvedMeta.totalPages <= 1 && !showSinglePageControls) return null;

    const hasEntries = resolvedMeta.total > 0;
    const startEntry = hasEntries ? ((page - 1) * resolvedMeta.limit) + 1 : 0;
    const endEntry = hasEntries ? Math.min(page * resolvedMeta.limit, resolvedMeta.total) : 0;

    const pages = Array.from({ length: resolvedMeta.totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === resolvedMeta.totalPages || Math.abs(p - page) <= 1)
        .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
            acc.push(p);
            return acc;
        }, []);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
                Showing {startEntry} to {endEntry} of {resolvedMeta.total} {summaryLabel}
            </p>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(page - 1)}
                            aria-disabled={!resolvedMeta.hasPrevPage}
                            className={!resolvedMeta.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {pages.map((p, idx) =>
                        p === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    onClick={() => onPageChange(p)}
                                    isActive={p === page}
                                    className="cursor-pointer"
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(page + 1)}
                            aria-disabled={!resolvedMeta.hasNextPage}
                            className={!resolvedMeta.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default DataPagination;
