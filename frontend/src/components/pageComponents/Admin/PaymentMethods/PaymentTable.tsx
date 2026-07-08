import DataPagination from "@/components/common/DataPagination";
import ErrorDialog from "@/components/common/dialog/ErrorDialog";
import PaymentMethodFilter from "@/components/pageComponents/Admin/PaymentMethods/PaymentMethodFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetPaymentMethodsQuery } from "@/hooks/admin/payment-methods.hook";
import { usePaymentMethodSearch } from "@/hooks/admin/payment-methods.search";
import { cn } from "@/lib/utils";
import { paymentMethodAdminStore } from "@/store/admin/paymentMethodAdmin.store";
import type { PaymentMethod } from "@/types/payment-method.type";
import { CheckCircle2, CreditCard, EllipsisVertical, QrCode } from "lucide-react";
import { useNavigate } from "react-router";

const paymentTypeLabel: Record<PaymentMethod["type"], string> = {
    BANK: "Bank Transfer",
    CASH: "Cash",
    GCASH: "GCash",
    MAYA: "Maya",
};

const PaymentTable = () => {
    const { search, isActive, page, limit, updatePage } = usePaymentMethodSearch();
    const setAvailabilityConfirmationId = paymentMethodAdminStore((state) => state.setAvailabilityConfirmationId);
    const navigate = useNavigate();

    const { data, isLoading, error, refetch, isRefetching } = useGetPaymentMethodsQuery({
        page,
        limit,
        search,
        isActive,
    });

    const methods = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            <div className="px-0 py-0">
                <PaymentMethodFilter />
            </div>

            {isLoading && (
                <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border/70 bg-background px-6 py-12 shadow-sm">
                    <LoadingSpinner className="size-8" />
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-border/70 bg-background p-6 shadow-sm">
                    <ErrorDialog
                    onBack={() => undefined}
                    onRetry={refetch}
                    retryLoading={isRefetching}
                    />
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {methods.length === 0 ? (
                        <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-border/70 bg-background px-6 py-12 text-center shadow-sm">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">
                                    {search || typeof isActive === "boolean"
                                        ? "No payment methods match the current filters."
                                        : "No payment methods yet."}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {search || typeof isActive === "boolean"
                                        ? "Try adjusting your search or status filter."
                                        : "Add your first payment channel to start showing options at checkout."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {methods.map((method) => (
                                <PaymentMethodCard
                                key={method.id}
                                method={method}
                                onEdit={() => navigate(`/admin/payment-methods/${method.id}/edit`)}
                                onAvailabilityChange={() => setAvailabilityConfirmationId(method.id)}
                                />
                            ))}
                        </div>
                    )}

                    {meta && (
                        <div className="pt-1">
                            <DataPagination
                            meta={meta}
                            page={page}
                            onPageChange={updatePage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

type PaymentMethodCardProps = {
    method: PaymentMethod;
    onEdit: () => void;
    onAvailabilityChange: () => void;
};

const PaymentMethodCard = ({ method, onEdit, onAvailabilityChange }: PaymentMethodCardProps) => {
    return (
        <div className="rounded-xl border border-border/70 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-foreground">{method.name}</h3>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full text-muted-foreground"
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <CreditCard className="h-4 w-4" />
                            Edit Method
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onAvailabilityChange}>
                            <CheckCircle2 className="h-4 w-4" />
                            {method.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-2 flex items-center gap-3">
                {method.qrCodeUrl ? (
                    <img src={method.qrCodeUrl} alt="QR Code" className="h-16 w-16" />
                ) : null}
                <div>
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-medium text-lg text-foreground">
                            {method.accountName || "No account name"}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-muted-foreground text-sm">
                            {method.accountNumber || "No account number"}
                        </span>
                    </div>
                </div>
            </div>

            {method.instructions ? (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {method.instructions}
                </p>
            ) : null}

            <div className="mt-4 flex justify-between flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                        <QrCode className="h-3.5 w-3.5" />
                        {method.qrCodeUrl ? "QR ready" : "No QR"}
                    </span>

                    <span>
                        {method.isActive ? "Visible to guests" : "Hidden from checkout"}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge>
                        {paymentTypeLabel[method.type]}
                    </Badge>
                    <Badge className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium shadow-none",
                        method.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600",
                    )}>
                        {method.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default PaymentTable;
