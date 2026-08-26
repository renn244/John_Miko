import { Button } from "@/components/ui/button";
import { useGetMenuItemCategoriesQuery, useGetMenuItemsQuery } from "@/hooks/admin/menu-item.hook";
import { formatPeso } from "@/lib/utils";
import type { MenuItem } from "@/types/admin/menu-item.type";
import { ArrowRight, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type PreOrderFormProps = {
    setBookingStep: Dispatch<SetStateAction<'form' | 'add-on' | 'review' | 'pre-order' | 'payment'>>,
    changePreOrderTotal?: (total: number) => void;
}

const PreOrderForm = ({ setBookingStep, changePreOrderTotal }: PreOrderFormProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [menuItemCache, setMenuItemCache] = useState<Record<string, MenuItem>>({});

    const { control, reset, getValues } = useFormContext<multiStepBookingFormSchema>();

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "preOrderItems",
    });

    const { data: categories } = useGetMenuItemCategoriesQuery();
    const { data } = useGetMenuItemsQuery({ 
        category: selectedCategory || undefined, 
        availability: 'Available'
    });

    const menuItems = data?.data || []

    useEffect(() => {
        if (menuItems) {
            setMenuItemCache(prev => {
                const next = { ...prev };
                menuItems.forEach(item => { next[item.id] = item; });
                return next;
            });
        }
    }, [menuItems]);

    const addToPreorder = (menuItem: MenuItem) => {
        setMenuItemCache(prev => ({ ...prev, [menuItem.id]: menuItem }));
        const existingIndex = fields.findIndex((f) => f.menuItemId === menuItem.id);
        if (existingIndex === -1) {
            append({ menuItemId: menuItem.id, quantity: 1 });
        } else {
            update(existingIndex, {
                menuItemId: menuItem.id,
                quantity: fields[existingIndex].quantity + 1,
            });
        }
    };

    const removeFromPreorder = (index: number) => remove(index);

    const updateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromPreorder(index);
        } else {
            update(index, {
                menuItemId: fields[index].menuItemId,
                quantity: newQuantity,
            });
        }
    };

    const handleContinue = () => {
        reset({ ...getValues() }, { keepValues: true });
        setBookingStep('review');
    };

    const preOrderTotal = useMemo(() => {
        const preOrderSub = fields.reduce((acc, field) => {
            const price = menuItemCache[field.menuItemId]?.price ?? 0;
            // TODO LATER: we can't just give 0 because if the price is missing, it means the item is invalid and should not contribute to the total

            return acc + price * field.quantity;
        }, 0);

        changePreOrderTotal?.(preOrderSub);
        return preOrderSub;
    }, [fields, menuItemCache]);

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">

            <div className="space-y-4">
                <div className="flex items-center">
                    <div>
                        <h3 className="text-xl font-bold tracking-normal">
                            Pre-order Dining
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pick food items now so they can be prepared for your stay.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                    type="button"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    variant={selectedCategory === null ? "default" : "outline"}
                    >
                        All
                    </Button>
                    {categories?.map((category) => (
                        <Button
                        key={category}
                        type="button"
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? "default" : "outline"}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {menuItems?.map((item) => {
                        const cartEntry = fields.find((f) => f.menuItemId === item.id);
                        return (
                            <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
                            style={{ borderColor: cartEntry ? '#1E73BE' : '#E5E7EB' }}
                            >
                                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
                                <div className="p-4">
                                    <h4 className="font-bold text-sm mb-1" style={{ color: '#1F2937' }}>
                                        {item.name}
                                    </h4>
                                    <p className="text-xs mb-2 line-clamp-2" style={{ color: '#6B7280' }}>
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold" style={{ color: '#1E73BE' }}>
                                            ₱{item.price.toLocaleString()}
                                        </span>
                                        {cartEntry ? (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        const index = fields.findIndex(f => f.menuItemId === item.id);
                                                        updateQuantity(index, cartEntry.quantity - 1);
                                                    }}
                                                    variant="outline"
                                                    size="icon-sm"
                                                >
                                                    <Minus className="size-3.5" />
                                                </Button>
                                                <span className="w-6 text-center font-bold text-sm">
                                                    {cartEntry.quantity}
                                                </span>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        const index = fields.findIndex(f => f.menuItemId === item.id);
                                                        updateQuantity(index, cartEntry.quantity + 1);
                                                    }}
                                                    variant="outline"
                                                    size="icon-sm"
                                                >
                                                    <Plus className="size-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size="sm" variant="outline" type="button" onClick={() => addToPreorder(item)}>
                                                <Plus className="w-4 h-4" /> Add
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                        <ShoppingCart className="w-5 h-5" />
                        Pre-ordered Items
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                            {fields.length} {fields.length === 1 ? 'item' : 'items'}
                        </span>
                    </h3>
                    {fields.length === 0 ? (
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm font-semibold">No food selected yet</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Choose menu items or continue without pre-orders.
                            </p>
                        </div>
                    ) : (
                    <div className="space-y-3">
                        {fields.map((field, index) => {
                            const menuItem = menuItemCache[field.menuItemId];
                            if (!menuItem) return null;
                            return (
                                <div key={field.id} className="rounded-lg bg-muted/60 p-3">
                                    <div className="flex gap-3">
                                        <img
                                        src={menuItem.imageUrl}
                                        alt={menuItem.name}
                                        className="size-12 rounded-md object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {menuItem.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {formatPeso(menuItem.price)} × {field.quantity}
                                            </p>
                                        </div>
                                        <Button
                                        type="button"
                                        onClick={() => removeFromPreorder(index)}
                                        variant="ghost"
                                        size="icon-sm"
                                        >
                                            <X className="size-3.5 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Button
                                            type="button"
                                            onClick={() => updateQuantity(index, field.quantity - 1)}
                                            variant="outline" size="icon-sm"
                                            >
                                                <Minus className="size-3.5" />
                                            </Button>
                                            <span className="w-6 text-center text-sm font-bold text-foreground">
                                                {field.quantity}
                                            </span>
                                            <Button
                                            type="button"
                                            onClick={() => updateQuantity(index, field.quantity + 1)}
                                            variant="outline" size="icon-sm"
                                            >
                                                <Plus className="size-3.5" />
                                            </Button>
                                        </div>

                                        <p className="text-sm font-bold text-primary">
                                            {formatPeso(menuItem.price * field.quantity)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <span className="font-bold">Pre Order Total:</span>
                        <span className="text-xl font-bold">{formatPeso(preOrderTotal)}</span>
                    </div>
                </div>

            <div className="space-y-2">
                <Button className="w-full" type="button" onClick={handleContinue}>
                    {fields.length > 0  ? "Continue to Review" : "Skip to Review"} <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full" type="button" onClick={() => setBookingStep('add-on')}>
                    Back to Add-ons
                </Button>
            </div>
            </aside>
        </div>
    );
};

export default PreOrderForm;
