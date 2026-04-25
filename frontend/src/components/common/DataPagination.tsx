import type { PaginationMeta } from "@/types/pagination.type"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"

type DataPaginationProps = {
    meta: PaginationMeta
    page: number
    onPageChange: (page: number) => void
}

const DataPagination = ({ meta, page, onPageChange }: DataPaginationProps) => {
    if(meta.totalPages <= 1) return null

    const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
        .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
            acc.push(p)
            return acc
        }, [])

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Showing {((page - 1) * meta.limit) + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total}
            </p>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                        onClick={() => onPageChange(page - 1)}
                        aria-disabled={!meta.hasPrevPage}
                        className={!meta.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {pages.map((p, idx) =>
                        p === 'ellipsis' ? (
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
                        )
                    )}

                    <PaginationItem>
                        <PaginationNext
                        onClick={() => onPageChange(page + 1)}
                        aria-disabled={!meta.hasNextPage}
                        className={!meta.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default DataPagination