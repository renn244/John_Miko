import { Button } from "@/components/ui/button";
import { useGetAvailableServicesForBookingQuery } from "@/hooks/add-on-service.hook";
import { toDateOnly } from "@/lib/date.util";
import { formatPeso } from "@/lib/utils";
import { useBookingSelectStore } from "@/store/booking/useBookingSelect";
import type { AddOnService } from "@/types/admin/add-on-service.type";
import { ArrowRight, Minus, Package, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type AddOnServiceFormProps = {
    setBookingStep: Dispatch<SetStateAction<"form" | "add-on" | "review" | "pre-order" | "payment">>;
    changeAddOnTotal?: (total: number) => void;
};

const AddOnServiceForm = ({ setBookingStep, changeAddOnTotal }: AddOnServiceFormProps) => {
    const bookingDate = useBookingSelectStore((s) => s.bookingDate);
    const stayOptionId = useBookingSelectStore((s) => s.bookingType);

    const query = bookingDate && stayOptionId ? { bookingDate: toDateOnly(bookingDate), stayOptionId } : null;
    const { data: services, isLoading } = useGetAvailableServicesForBookingQuery(query);

    const [serviceCache, setServiceCache] = useState<Record<string, AddOnService>>({});

    const { control, reset, getValues } = useFormContext<multiStepBookingFormSchema>();

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "addOnServices",
    });

    useEffect(() => {
        if (services) {
            setServiceCache((prev) => {
                const next = { ...prev };
                services.forEach((service) => {
                    next[service.id] = service;
                });
                return next;
            });
        }
    }, [services]);

    const getSelectedQuantity = (serviceId: string) => {
        const entry = fields.find((f) => f.addOnServiceId === serviceId);
        return entry?.quantity ?? 0;
    };

    const addToSelection = (service: AddOnService) => {
        setServiceCache((prev) => ({ ...prev, [service.id]: service }));

        const existingIndex = fields.findIndex((f) => f.addOnServiceId === service.id);
        const currentSelected = getSelectedQuantity(service.id);
        const maxAvailable = service.quantity;

        if (currentSelected >= maxAvailable) return;

        if (existingIndex === -1) {
            append({
                addOnServiceId: service.id,
                quantity: 1,
                name: service.name,
                price: service.price,
                imageUrl: service.imageUrl,
            });
        } else {
            update(existingIndex, {
                ...fields[existingIndex],
                quantity: fields[existingIndex].quantity + 1,
            });
        }
    };

    const removeFromSelection = (index: number) => remove(index);

    const updateQuantity = (index: number, newQuantity: number) => {
        const field = fields[index];
        const service = serviceCache[field.addOnServiceId];
        const maxAvailable = service?.quantity ?? Number.POSITIVE_INFINITY;

        if (newQuantity <= 0) {
            removeFromSelection(index);
            return;
        }

        update(index, {
            ...field,
            quantity: Math.min(newQuantity, maxAvailable),
        });
    };

    const handleContinue = () => {
        reset({ ...getValues() }, { keepValues: true });
        setBookingStep("pre-order");
    };

    const addOnTotal = useMemo(() => {
        const total = fields.reduce((acc, field) => {
            const price = field.price ?? serviceCache[field.addOnServiceId]?.price ?? 0;
            return acc + price * field.quantity;
        }, 0);

        changeAddOnTotal?.(total);
        return total;
    }, [fields, serviceCache]);

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
                <div className="flex items-center">
                    <div>
                        <h3 className="text-xl font-bold tracking-normal">Enhance your stay</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Select optional services for your booking. You can also skip this step.
                        </p>
                    </div>
                </div>

                <div className="grid max-h-[34rem] grid-cols-1 gap-4 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] sm:grid-cols-2 [&::-webkit-scrollbar]:hidden">
                    {isLoading
                        ? null
                        : services?.map((service) => {
                              const selectedQty = getSelectedQuantity(service.id);
                              const isSelected = selectedQty > 0;

                              return (
                                  <div
                                      key={service.id}
                                      className="overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
                                      style={{ borderColor: isSelected ? "#1E73BE" : "#E5E7EB" }}
                                  >
                                      <img
                                          src={service.imageUrl}
                                          alt={service.name}
                                          className="w-full h-32 object-cover"
                                      />
                                      <div className="p-4">
                                          <h4 className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>
                                              {service.name}
                                          </h4>
                                          {service.description && (
                                              <p className="text-xs mb-2 line-clamp-2" style={{ color: "#6B7280" }}>
                                                  {service.description}
                                              </p>
                                          )}

                                          <div className="flex items-center justify-between mb-2">
                                              <span className="font-bold" style={{ color: "#1E73BE" }}>
                                                  ₱{service.price.toLocaleString()}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                  {service.quantity} unit{service.quantity === 1 ? "" : "s"} available
                                              </span>
                                          </div>

                                          <div className="flex items-center justify-between">
                                              {isSelected ? (
                                                  <div className="flex items-center gap-2">
                                                      <Button
                                                          type="button"
                                                          onClick={() => {
                                                              const index = fields.findIndex(
                                                                  (f) => f.addOnServiceId === service.id
                                                              );
                                                              updateQuantity(index, selectedQty - 1);
                                                          }}
                                                          variant="outline"
                                                          size="icon-sm"
                                                      >
                                                          <Minus className="size-3.5" />
                                                      </Button>
                                                      <span className="w-6 text-center font-bold text-sm">{selectedQty}</span>
                                                      <Button
                                                          type="button"
                                                          onClick={() => {
                                                              const index = fields.findIndex(
                                                                  (f) => f.addOnServiceId === service.id
                                                              );
                                                              updateQuantity(index, selectedQty + 1);
                                                          }}
                                                          variant="outline"
                                                          size="icon-sm"
                                                      >
                                                          <Plus className="size-3.5" />
                                                      </Button>
                                                  </div>
                                              ) : (
                                                  <Button size="sm" variant="outline" type="button" onClick={() => addToSelection(service)}>
                                                      <Plus className="w-4 h-4" /> Add
                                                  </Button>
                                              )}

                                              {isSelected && (
                                                  <Button
                                                      size="sm"
                                                      type="button"
                                                      variant="outline"
                                                      onClick={() => {
                                                          const index = fields.findIndex(
                                                              (f) => f.addOnServiceId === service.id
                                                          );
                                                          if (index >= 0) removeFromSelection(index);
                                                      }}
                                                  >
                                                      Remove
                                                  </Button>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                </div>

                {!isLoading && services?.length === 0 && (
                    <div className="rounded-xl p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
                        <h3 className="text-xl font-bold mb-2">No Services Available</h3>
                        <p className="text-sm mb-6 text-muted-foreground">
                            There are currently no add-on services available for your selected date and stay type.
                        </p>
                    </div>
                )}
            </div>

            <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                        <ShoppingCart className="w-5 h-5" />
                        Selected Services
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                            {fields.length} {fields.length === 1 ? "service" : "services"}
                        </span>
                    </h3>

                    {fields.length === 0 ? (
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm font-semibold">No add-ons selected yet</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Choose services from the list or skip this step.
                            </p>
                        </div>
                    ) : (
                    <div className="space-y-3">
                        {fields.map((field, index) => {
                            const service = serviceCache[field.addOnServiceId];
                            const imageUrl = field.imageUrl ?? service?.imageUrl;
                            const name = field.name ?? service?.name;
                            const price = field.price ?? service?.price ?? 0;

                            if (!name) return null;

                            return (
                                <div key={field.id} className="rounded-lg bg-muted/60 p-3">
                                    <div className="flex gap-3">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={name}
                                                className="size-12 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="size-12 rounded-md bg-gray-200" />
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">{name}</p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {formatPeso(price)} × {field.quantity}
                                            </p>
                                        </div>

                                        <Button type="button" onClick={() => removeFromSelection(index)} variant="ghost" size="icon-sm">
                                            <X className="size-3.5 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                type="button"
                                                onClick={() => updateQuantity(index, field.quantity - 1)}
                                                variant="outline"
                                                size="icon-sm"
                                            >
                                                <Minus className="size-3.5" />
                                            </Button>
                                            <span className="w-6 text-center text-sm font-bold text-foreground">
                                                {field.quantity}
                                            </span>
                                            <Button
                                                type="button"
                                                onClick={() => updateQuantity(index, field.quantity + 1)}
                                                variant="outline"
                                                size="icon-sm"
                                            >
                                                <Plus className="size-3.5" />
                                            </Button>
                                        </div>

                                        <p className="text-sm font-bold text-primary">
                                            {formatPeso(price * field.quantity)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <span className="font-bold">Add-on Subtotal:</span>
                        <span className="text-xl font-bold">{formatPeso(addOnTotal)}</span>
                    </div>
                </div>

            <div className="space-y-2">
                <Button className="w-full" type="button" onClick={handleContinue}>
                    {fields.length > 0 ? "Continue to Pre-order" : "Skip to Pre-order"}{" "}
                    <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full" type="button" onClick={() => setBookingStep("form")}
                >
                    Back to Form
                </Button>
            </div>
            </aside>
        </div>
    );
};

export default AddOnServiceForm;
