import { TableCell, TableRow } from "@/components/ui/table";

type AdminTableEmptyStateProps = {
    colSpan: number;
    emptyMessage: string;
    filteredMessage?: string;
    hasActiveFilters?: boolean;
    className?: string;
};

const AdminTableEmptyState = ({
    colSpan,
    emptyMessage,
    filteredMessage,
    hasActiveFilters = false,
    className,
}: AdminTableEmptyStateProps) => {
    const message = hasActiveFilters && filteredMessage ? filteredMessage : emptyMessage;

    return (
        <TableRow>
            <TableCell colSpan={colSpan} className={className ?? "py-8 text-center text-sm text-muted-foreground"}>
                {message}
            </TableCell>
        </TableRow>
    );
};

export default AdminTableEmptyState;
