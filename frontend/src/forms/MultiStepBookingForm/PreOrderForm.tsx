import { Button } from "@/components/ui/button";
import { useGetMenuItemCategoriesQuery, useGetMenuItemsQuery } from "@/hooks/admin/menu-item.hook";
import type { MenuItem } from "@/types/admin/menu-item.type";
import { ArrowRight, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type PreOrderFormProps = {
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'pre-order' | 'payment'>>,
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
        <div className="space-y-6">

            <div>
                <div className="flex items-center">
                    <h3 className="font-bold text-lg" style={{ color: '#1F2937' }}>
                        Select Items
                    </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                    onClick={() => setSelectedCategory(null)}
                    variant={selectedCategory === null ? "default" : "secondary"}
                    >
                        All
                    </Button>
                    {categories?.map((category) => (
                        <Button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? "default" : "secondary"}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-150 overflow-y-auto  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-2">
                    {menuItems?.map((item) => {
                        const cartEntry = fields.find((f) => f.menuItemId === item.id);
                        return (
                            <div
                            key={item.id}
                            className="border-2 rounded-xl overflow-hidden hover:shadow-md transition-all"
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
                                                <button
                                                    onClick={() => {
                                                        const index = fields.findIndex(f => f.menuItemId === item.id);
                                                        updateQuantity(index, cartEntry.quantity - 1);
                                                    }}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center border-2 hover:bg-gray-100 transition-colors"
                                                    style={{ borderColor: '#E5E7EB' }}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 text-center font-bold text-sm">
                                                    {cartEntry.quantity}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        const index = fields.findIndex(f => f.menuItemId === item.id);
                                                        updateQuantity(index, cartEntry.quantity + 1);
                                                    }}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center border-2 hover:bg-gray-100 transition-colors"
                                                    style={{ borderColor: '#E5E7EB' }}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Button size="sm" onClick={() => addToPreorder(item)}>
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

            {fields.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Pre-ordered Items
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                            {fields.length} {fields.length === 1 ? 'item' : 'items'}
                        </span>
                    </h3>
                    <div className="space-y-3">
                        {fields.map((field, index) => {
                            const menuItem = menuItemCache[field.menuItemId];
                            if (!menuItem) return null;
                            return (
                                <div
                                key={field.id}
                                className="flex items-center gap-4 p-3 rounded-lg bg-muted"
                                >
                                    <img
                                    src={menuItem.imageUrl}
                                    alt={menuItem.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            {menuItem.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            ₱{menuItem.price.toLocaleString()} × {field.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                        onClick={() => updateQuantity(index, field.quantity - 1)}
                                        variant="outline" size="icon-sm"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-8 text-center font-bold" style={{ color: '#1F2937' }}>
                                            {field.quantity}
                                        </span>
                                        <Button
                                        onClick={() => updateQuantity(index, field.quantity + 1)}
                                        variant="outline" size="icon-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="font-bold w-20 text-right" style={{ color: '#1E73BE' }}>
                                        ₱{(menuItem.price * field.quantity).toLocaleString()}
                                    </p>
                                    <Button
                                    onClick={() => removeFromPreorder(index)}
                                    variant="ghost"
                                    size="icon-sm"
                                    >
                                        <X className="w-5 h-5 text-destructive" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="font-bold">Pre Order Total:</span>
                        <span className="text-xl font-bold">₱{preOrderTotal.toLocaleString()}</span>
                    </div>
                </div>
            )}

            <div className="space-y-2   mt-">
                <Button className="w-full" onClick={handleContinue}>
                    {fields.length > 0  ? "Continue to Review" : "Skip to Review"} <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setBookingStep('form')}>
                    Back to Form
                </Button>
            </div>
        </div>
    );
};

export default PreOrderForm;