import { Button } from "@/components/ui/button";
import { useGetAvailableServicesForBookingQuery } from "@/hooks/add-on-service.hook";
import { toDateOnly } from "@/lib/date.util";
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
    const timeSlot = useBookingSelectStore((s) => s.bookingType);

    const query = bookingDate && timeSlot ? { bookingDate: toDateOnly(bookingDate), timeSlot } : null;
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
        <div className="space-y-6">
            <div>
                <div className="flex items-center mb-2">
                    <h3 className="font-bold text-lg">Select Add-on Services</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-150 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-2">
                    {isLoading
                        ? null
                        : services?.map((service) => {
                              const selectedQty = getSelectedQuantity(service.id);
                              const isSelected = selectedQty > 0;

                              return (
                                  <div
                                      key={service.id}
                                      className="border-2 rounded-xl overflow-hidden hover:shadow-md transition-all"
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
                                                      <button
                                                          type="button"
                                                          onClick={() => {
                                                              const index = fields.findIndex(
                                                                  (f) => f.addOnServiceId === service.id
                                                              );
                                                              updateQuantity(index, selectedQty - 1);
                                                          }}
                                                          className="w-7 h-7 rounded-lg flex items-center justify-center border-2 hover:bg-gray-100 transition-colors"
                                                          style={{ borderColor: "#E5E7EB" }}
                                                      >
                                                          <Minus className="w-3 h-3" />
                                                      </button>
                                                      <span className="w-6 text-center font-bold text-sm">{selectedQty}</span>
                                                      <button
                                                          type="button"
                                                          onClick={() => {
                                                              const index = fields.findIndex(
                                                                  (f) => f.addOnServiceId === service.id
                                                              );
                                                              updateQuantity(index, selectedQty + 1);
                                                          }}
                                                          className="w-7 h-7 rounded-lg flex items-center justify-center border-2 hover:bg-gray-100 transition-colors"
                                                          style={{ borderColor: "#E5E7EB" }}
                                                      >
                                                          <Plus className="w-3 h-3" />
                                                      </button>
                                                  </div>
                                              ) : (
                                                  <Button size="sm" type="button" onClick={() => addToSelection(service)}>
                                                      <Plus className="w-4 h-4" /> Add
                                                  </Button>
                                              )}

                                              {isSelected && (
                                                  <Button
                                                      size="sm"
                                                      type="button"
                                                      variant="secondary"
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

            {fields.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Selected Services
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                            {fields.length} {fields.length === 1 ? "service" : "services"}
                        </span>
                    </h3>

                    <div className="space-y-3">
                        {fields.map((field, index) => {
                            const service = serviceCache[field.addOnServiceId];
                            const imageUrl = field.imageUrl ?? service?.imageUrl;
                            const name = field.name ?? service?.name;
                            const price = field.price ?? service?.price ?? 0;

                            if (!name) return null;

                            return (
                                <div key={field.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gray-200" />
                                    )}

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            ₱{price.toLocaleString()} × {field.quantity}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => updateQuantity(index, field.quantity - 1)}
                                            variant="outline"
                                            size="icon-sm"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-8 text-center font-bold" style={{ color: "#1F2937" }}>
                                            {field.quantity}
                                        </span>
                                        <Button
                                            type="button"
                                            onClick={() => updateQuantity(index, field.quantity + 1)}
                                            variant="outline"
                                            size="icon-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <p className="font-bold w-20 text-right" style={{ color: "#1E73BE" }}>
                                        ₱{(price * field.quantity).toLocaleString()}
                                    </p>

                                    <Button type="button" onClick={() => removeFromSelection(index)} variant="ghost" size="icon-sm">
                                        <X className="w-5 h-5 text-destructive" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="font-bold">Add-on Subtotal:</span>
                        <span className="text-xl font-bold">₱{addOnTotal.toLocaleString()}</span>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default AddOnServiceForm;
