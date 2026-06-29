import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestInfoChip,
    GuestPageShell,
} from "@/components/guest";
import { Button } from "@/components/ui/button";
import { useGetMenuItemCategoriesQuery, useGetMenuItemsQuery } from "@/hooks/admin/menu-item.hook";
import { formatPeso } from "@/lib/utils";
import type { MenuItem } from "@/types/admin/menu-item.type";
import { AlertCircle, Clock, ImageIcon, RefreshCcw, ShieldCheck, Utensils } from "lucide-react";
import { useMemo, useState } from "react";

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { data: categories } = useGetMenuItemCategoriesQuery();
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetMenuItemsQuery({
        availability: "Available",
        category: selectedCategory || undefined,
        limit: 100,
    });

    const menuItems = data?.data ?? [];
    const categoryGroups = useMemo(() => {
        const categoryNames = selectedCategory
            ? [selectedCategory]
            : Array.from(new Set(menuItems.map((item) => item.category)));

        return categoryNames
            .map((category) => ({
                category,
                items: menuItems.filter((item) => item.category === category),
            }))
            .filter((group) => group.items.length > 0);
    }, [menuItems, selectedCategory]);

    return (
        <GuestPageShell>
            <NavBar />

            <GuestContainer className="pt-4">
                <section className="relative min-h-[320px] overflow-hidden rounded-xl border bg-muted md:min-h-[380px]">
                    <img
                        src="https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=1600&q=80"
                        alt="Filipino dishes prepared for guests"
                        className="absolute inset-0 size-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/10" />
                    <div className="relative z-10 flex min-h-[320px] max-w-2xl flex-col justify-end p-5 text-white md:min-h-[380px] md:p-8">
                        <div className="mb-4 flex flex-wrap gap-2">
                            <GuestInfoChip className="border-white/25 bg-white/15 text-white backdrop-blur">
                                Filipino favorites
                            </GuestInfoChip>
                            <GuestInfoChip className="border-white/25 bg-white/15 text-white backdrop-blur">
                                Pre-order during booking
                            </GuestInfoChip>
                        </div>
                        <h1 className="text-4xl font-bold tracking-normal md:text-5xl">
                            Culinary Delights
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 md:text-base">
                            Browse the resort menu and plan your meals ahead. Food selection happens during the booking flow.
                        </p>
                    </div>
                </section>
            </GuestContainer>

            <GuestContainer className="py-9 md:py-12">
                <div className="space-y-10 md:space-y-12">
                    <section>
                        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-normal">
                                    Resort Menu
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                    Menu items are managed from the catalog and may change based on availability.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    All
                                </Button>
                                {categories?.map((category) => (
                                    <Button
                                        key={category}
                                        type="button"
                                        size="sm"
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-5 lg:grid-cols-2">
                                {[0, 1].map((group) => (
                                    <GuestCard key={group} className="p-0">
                                        <div className="border-b p-4">
                                            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                                        </div>
                                        <div className="divide-y">
                                            {[0, 1, 2].map((item) => (
                                                <div key={item} className="flex gap-4 p-4">
                                                    <div className="size-20 animate-pulse rounded-lg bg-muted" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                                                        <div className="h-3 w-full animate-pulse rounded bg-muted" />
                                                        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </GuestCard>
                                ))}
                            </div>
                        ) : isError ? (
                            <GuestCard className="mx-auto max-w-md text-center">
                                <AlertCircle className="mx-auto size-8 text-destructive" />
                                <h3 className="mt-3 text-lg font-bold">Unable to load menu</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    We could not retrieve the menu catalog. Please try again.
                                </p>
                                <Button type="button" className="mt-4" onClick={() => refetch()}>
                                    <RefreshCcw className="size-4" />
                                    Retry
                                </Button>
                            </GuestCard>
                        ) : menuItems.length === 0 ? (
                            <GuestCard className="mx-auto max-w-md text-center">
                                <Utensils className="mx-auto size-8 text-muted-foreground" />
                                <h3 className="mt-3 text-lg font-bold">No menu items available</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Available food items will appear here once the catalog is updated.
                                </p>
                            </GuestCard>
                        ) : (
                            <div className="grid gap-5 lg:grid-cols-2">
                                {categoryGroups.map((group) => (
                                    <GuestCard key={group.category} padded={false} className="overflow-hidden">
                                        <div className="flex items-center gap-2 border-b p-4">
                                            <Utensils className="size-4 text-primary" />
                                            <h3 className="text-lg font-bold tracking-normal">
                                                {group.category}
                                            </h3>
                                        </div>
                                        <div className="divide-y">
                                            {group.items.map((item) => (
                                                <article key={item.id} className="flex gap-4 p-4">
                                                    <MenuItemImage item={item} />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <h4 className="font-semibold leading-tight">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                            <p className="shrink-0 font-bold text-primary">
                                                                {formatPeso(item.price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </GuestCard>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold tracking-normal">
                            Dining & Corkage Information
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <GuestCard className="p-5">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 size-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold">Outside Food & Corkage</h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            Bringing outside food is allowed. Standard corkage fees apply for food and drinks brought onto the premises.
                                        </p>
                                    </div>
                                </div>
                            </GuestCard>
                            <GuestCard className="p-5">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 size-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold">Pre-Order Timing</h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            To ensure availability and fresh preparation, please finalize food pre-orders during booking.
                                        </p>
                                    </div>
                                </div>
                            </GuestCard>
                        </div>
                    </section>
                </div>
            </GuestContainer>

            <Footer />
        </GuestPageShell>
    );
};

const MenuItemImage = ({ item }: { item: MenuItem }) => {
    const [hasImageError, setHasImageError] = useState(false);

    if (hasImageError || !item.imageUrl) {
        return (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                <ImageIcon className="size-5" />
            </div>
        );
    }

    return (
        <img
            src={item.imageUrl}
            alt={item.name}
            className="size-20 shrink-0 rounded-lg object-cover"
            loading="lazy"
            onError={() => setHasImageError(true)}
        />
    );
};

export default Menu;