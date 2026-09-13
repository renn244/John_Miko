import { Button } from "@/components/ui/button";
import { useGetMenuItemCategoriesQuery, useGetMenuItemsQuery } from "@/features/shared/menu-items/hooks/useMenuItemQueries";
import { formatPeso } from "@/lib/utils";
import type { MenuItem } from "@/features/shared/menu-items/types/menu-item.type";
import { ChevronDown, Minus, Pizza, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ManualBookingFormValues } from "./manualBooking.schema";

type ManualPreOrderSelectorProps = {
    onSubtotalChange: (subtotal: number) => void;
};

const ManualPreOrderSelector = ({ onSubtotalChange }: ManualPreOrderSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const { control } = useFormContext<ManualBookingFormValues>();
    const { fields, append, remove, update } = useFieldArray({ control, name: "preOrderItems" });
    const { data: categories, isError: categoriesError } = useGetMenuItemCategoriesQuery();
    const { data, isLoading, isError } = useGetMenuItemsQuery({
        availability: "Available",
        category: selectedCategory,
        page: 1,
        limit: 100,
    });
    const menuItems = data?.data ?? [];

    const subtotal = useMemo(() => fields.reduce((total, item) => (
        total + item.price * item.quantity
    ), 0), [fields]);

    useEffect(() => {
        onSubtotalChange(subtotal);
    }, [onSubtotalChange, subtotal]);

    const selectedQuantity = (menuItemId: string) => (
        fields.find((item) => item.menuItemId === menuItemId)?.quantity ?? 0
    );

    const changeQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            remove(index);
            return;
        }

        update(index, { ...fields[index], quantity });
    };

    const addMenuItem = (menuItem: MenuItem) => {
        const existingIndex = fields.findIndex((item) => item.menuItemId === menuItem.id);
        if (existingIndex >= 0) {
            changeQuantity(existingIndex, fields[existingIndex].quantity + 1);
            return;
        }

        append({
            menuItemId: menuItem.id,
            quantity: 1,
            name: menuItem.name,
            price: menuItem.price,
            imageUrl: menuItem.imageUrl,
        });
    };

    const selectedUnits = fields.reduce((total, item) => total + item.quantity, 0);

    return (
        <section>
            <button
                type="button"
                className="flex w-full items-center pb-2 gap-4 text-left"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">Food Preorders <span className="font-normal text-muted-foreground">(Optional)</span></h3>
                    <p className="mt-1 text-xs text-muted-foreground">Select available menu items for the guest.</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {selectedUnits > 0 ? <span className="text-xs text-muted-foreground">{selectedUnits} selected</span> : null}
                    <span className="text-sm font-medium text-primary">{formatPeso(subtotal)}</span>
                    <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </button>

            {isOpen ? (
                <div className="pb-4">
                    {!categoriesError && categories?.length ? (
                        <div className="mb-4 flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant={!selectedCategory ? "default" : "secondary"} onClick={() => setSelectedCategory(undefined)}>All</Button>
                            {categories.map((category) => (
                                <Button key={category} type="button" size="sm" variant={selectedCategory === category ? "default" : "secondary"} onClick={() => setSelectedCategory(category)}>
                                    {category}
                                </Button>
                            ))}
                        </div>
                    ) : null}

                    {isLoading ? (
                        <div className="rounded-lg bg-muted/40 p-8 text-center text-sm text-muted-foreground">Loading available menu items...</div>
                    ) : isError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                            Available menu items could not be loaded. Try closing and reopening this section.
                        </div>
                    ) : menuItems.length ? (
                        <div className="space-y-5">
                            <div className="grid gap-x-8 sm:grid-cols-2">
                                {menuItems.map((menuItem) => {
                                    const quantity = selectedQuantity(menuItem.id);
                                    return (
                                        <article key={menuItem.id} className="flex flex-col gap-2 border-b border-border py-3">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-medium">{menuItem.name}</h4>
                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{menuItem.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-medium text-primary">{formatPeso(menuItem.price)}</p>
                                                {quantity > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button type="button" variant="outline" size="icon-sm" onClick={() => changeQuantity(fields.findIndex((item) => item.menuItemId === menuItem.id), quantity - 1)}><Minus /></Button>
                                                        <span className="w-8 text-center font-semibold">{quantity}</span>
                                                        <Button type="button" variant="outline" size="icon-sm" onClick={() => changeQuantity(fields.findIndex((item) => item.menuItemId === menuItem.id), quantity + 1)}><Plus /></Button>
                                                    </div>
                                                ) : (
                                                    <Button type="button" size="sm" onClick={() => addMenuItem(menuItem)}><Plus /> Add</Button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <aside className="border-t border-border pt-4">
                                <h4 className="text-sm font-medium">Selected preorders</h4>
                                {fields.length === 0 ? (
                                    <p className="mt-2 text-xs text-muted-foreground">No food preordered.</p>
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
                            <Pizza className="mx-auto mb-3 size-10 text-muted-foreground" />
                            <p className="font-semibold">No menu items available</p>
                            <p className="mt-1 text-sm text-muted-foreground">There are no available items in this category.</p>
                        </div>
                    )}
                </div>
            ) : null}
        </section>
    );
};

export default ManualPreOrderSelector;
