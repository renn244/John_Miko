import { Button } from "@/components/ui/button";
import { useGetAvailableServicesForBookingQuery } from "@/features/shared/add-on-services/hooks/useAvailableAddOnServices";
import type { AddOnService } from "@/features/shared/add-on-services/types/add-on-service.type";
import { toDateOnly } from "@/lib/date.util";
import { formatPeso } from "@/lib/utils";
import { ChevronDown, Minus, Package, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { ManualBookingFormValues } from "./manualBooking.schema";

type ManualAddOnSelectorProps = {
    bookingDate?: Date;
    stayOptionId?: string;
    onSubtotalChange: (subtotal: number) => void;
};

const ManualAddOnSelector = ({ bookingDate, stayOptionId, onSubtotalChange }: ManualAddOnSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const previousStayKey = useRef<string | null | undefined>(undefined);
    const { control } = useFormContext<ManualBookingFormValues>();
    const { fields, append, remove, replace, update } = useFieldArray({ control, name: "addOnServices" });

    const bookingDateValue = bookingDate ? toDateOnly(bookingDate) : null;
    const stayKey = bookingDateValue && stayOptionId ? `${bookingDateValue}:${stayOptionId}` : null;
    const query = bookingDateValue && stayOptionId ? { bookingDate: bookingDateValue, stayOptionId } : null;
    const { data: services, isLoading, isError } = useGetAvailableServicesForBookingQuery(query);

    useEffect(() => {
        const previousKey = previousStayKey.current;
        previousStayKey.current = stayKey;

        if (previousKey !== undefined && previousKey !== stayKey && fields.length > 0) {
            replace([]);
            toast.info("Selected add-ons were cleared because the stay details changed.");
        }
    }, [fields.length, replace, stayKey]);

    const subtotal = useMemo(() => fields.reduce((total, item) => (
        total + item.price * item.quantity
    ), 0), [fields]);

    useEffect(() => {
        onSubtotalChange(subtotal);
    }, [onSubtotalChange, subtotal]);

    const selectedQuantity = (serviceId: string) => (
        fields.find((item) => item.addOnServiceId === serviceId)?.quantity ?? 0
    );

    const changeQuantity = (index: number, quantity: number, maximumQuantity: number) => {
        if (quantity <= 0) {
            remove(index);
            return;
        }

        const item = fields[index];
        update(index, { ...item, quantity: Math.min(quantity, maximumQuantity) });
    };

    const addService = (service: AddOnService) => {
        const existingIndex = fields.findIndex((item) => item.addOnServiceId === service.id);
        if (existingIndex >= 0) {
            changeQuantity(existingIndex, fields[existingIndex].quantity + 1, service.quantity);
            return;
        }

        append({
            addOnServiceId: service.id,
            quantity: 1,
            name: service.name,
            price: service.price,
            imageUrl: service.imageUrl,
        });
    };

    const selectedUnits = fields.reduce((total, item) => total + item.quantity, 0);
    const canSelect = Boolean(stayKey);

    return (
        <section>
            <button
                type="button"
                className="flex w-full items-center gap-4 pb-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setIsOpen((open) => !open)}
                disabled={!canSelect}
                aria-expanded={isOpen}
            >
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">Add-on Services <span className="font-normal text-muted-foreground">(Optional)</span></h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {canSelect ? "Reserve available services for this stay." : "Select a check-in date and stay option first."}
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {selectedUnits > 0 ? <span className="text-xs text-muted-foreground">{selectedUnits} selected</span> : null}
                    <span className="text-sm font-medium text-primary">{formatPeso(subtotal)}</span>
                    <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </button>

            {isOpen ? (
                <div className="pb-4">
                    {isLoading ? (
                        <div className="rounded-lg bg-muted/40 p-8 text-center text-sm text-muted-foreground">Loading available services...</div>
                    ) : isError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                            Available add-on services could not be loaded. Try closing and reopening this section.
                        </div>
                    ) : services?.length ? (
                        <div className="space-y-5">
                            <div className="grid gap-x-8 sm:grid-cols-2">
                                {services.map((service) => {
                                    const quantity = selectedQuantity(service.id);
                                    return (
                                        <article key={service.id} className="flex flex-col gap-2 border-b border-border py-3">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-medium">{service.name}</h4>
                                                {service.description ? <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{service.description}</p> : null}
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-sm font-medium text-primary">{formatPeso(service.price)}</p>
                                                    <p className="text-xs text-muted-foreground">{service.quantity} available</p>
                                                </div>
                                                {quantity > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button type="button" variant="outline" size="icon-sm" onClick={() => changeQuantity(fields.findIndex((item) => item.addOnServiceId === service.id), quantity - 1, service.quantity)}>
                                                            <Minus />
                                                        </Button>
                                                        <span className="w-8 text-center font-semibold">{quantity}</span>
                                                        <Button type="button" variant="outline" size="icon-sm" disabled={quantity >= service.quantity} onClick={() => changeQuantity(fields.findIndex((item) => item.addOnServiceId === service.id), quantity + 1, service.quantity)}>
                                                            <Plus />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button type="button" size="sm" onClick={() => addService(service)}><Plus /> Add</Button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <aside className="border-t border-border pt-4">
                                <h4 className="text-sm font-medium">Selected add-ons</h4>
                                {fields.length === 0 ? (
                                    <p className="mt-2 text-xs text-muted-foreground">No add-ons selected.</p>
                                ) : (
                                    <div className="mt-2 divide-y divide-border">
                                        {fields.map((item, index) => (
                                            <div key={item.id} className="flex items-center gap-3 py-2 first:pt-0">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatPeso(item.price)} × {item.quantity}</p>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon-xs" onClick={() => remove(index)}><X /></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                                    <span className="text-sm font-medium">Subtotal</span>
                                    <span className="text-sm font-medium text-primary">{formatPeso(subtotal)}</span>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <Package className="mx-auto mb-3 size-10 text-muted-foreground" />
                            <p className="font-semibold">No services available</p>
                            <p className="mt-1 text-sm text-muted-foreground">Nothing is available for this date and stay option.</p>
                        </div>
                    )}
                </div>
            ) : null}
        </section>
    );
};

export default ManualAddOnSelector;
