import DataPagination from "@/components/common/DataPagination"
import ErrorDialog from "@/components/common/dialog/ErrorDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetPaymentMethodsQuery, useUpdatePaymentMethodMutation } from "@/hooks/admin/payment-methods.hook"
import { usePaymentMethodSearch } from "@/hooks/admin/payment-methods.search"
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store"
import type { PaymentMethod } from "@/types/payment-method.type"
import { Pencil, Trash2 } from "lucide-react"

const PaymentTable = () => {
    const { page, limit, updatePage } = usePaymentMethodSearch();
    const setDeleteId = paymentMethodAdminStore((state) => state.setDeleteId);
    const setEditId = paymentMethodAdminStore((state) => state.setEditId);

    const { data, isLoading, error, refetch, isRefetching } = useGetPaymentMethodsQuery({
        page,
        limit,
    });
    
    const methods = data?.data ?? [];
    const meta = data?.meta;

    return (
        <Card className="border-2">
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner className="size-8" />
                </div>
            )}
            {error && (
                <div className="p-6">
                    <ErrorDialog
                    onBack={() => undefined}
                    onRetry={refetch}
                    retryLoading={isRefetching}
                    />
                </div>
            )}
            {!isLoading && !error && (
                <div className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Account</TableHead>
                                <TableHead>QR</TableHead>
                                <TableHead>Sort</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {methods.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                        No payment methods yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {methods.map((method) => (
                                <PaymentMethodRow
                                key={method.id}
                                method={method}
                                onEdit={() => setEditId(method.id)}
                                onDelete={() => setDeleteId(method.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    {meta && (
                        <DataPagination 
                        meta={meta}
                        page={page}
                        onPageChange={updatePage}
                        />
                    )}
                </div>
            )}
        </Card>
    )
}


type PaymentMethodRowProps = {
    method: PaymentMethod;
    onEdit: () => void;
    onDelete: () => void;
};

const PaymentMethodRow = ({ method, onEdit, onDelete }: PaymentMethodRowProps) => {
    const { mutateAsync: updateMethod, isPending } = useUpdatePaymentMethodMutation(method.id);

    const handleToggle = async (nextValue: boolean) => {
        await updateMethod({ isActive: nextValue });
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{method.name}</TableCell>
            <TableCell>
                <Badge variant="outline">{method.type}</Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
                {method.accountName || "—"}
                {method.accountName && method.accountNumber ? " • " : ""}
                {method.accountNumber || ""}
            </TableCell>
            <TableCell>
                {method.qrCodeUrl ? (
                    <Badge variant="secondary">QR Uploaded</Badge>
                ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                )}
            </TableCell>
            <TableCell>{method.sortOrder}</TableCell>
            <TableCell>
                <Switch
                checked={method.isActive}
                onCheckedChange={handleToggle}
                disabled={isPending}
                />
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit()}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete()}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default PaymentTable