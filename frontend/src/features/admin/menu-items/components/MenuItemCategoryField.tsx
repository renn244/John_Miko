import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FieldDescription, FieldError } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetMenuItemCategoriesQuery } from "@/features/shared/menu-items/hooks/useMenuItemQueries";
import { formatMenuCategory } from "@/features/shared/menu-items/lib/formatMenuCategory";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import type { FieldError as ReactHookFormFieldError } from "react-hook-form";

type MenuItemCategoryFieldProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  invalid: boolean;
  error?: ReactHookFormFieldError;
};

const MenuItemCategoryField = ({
  id,
  value,
  onValueChange,
  invalid,
  error,
}: MenuItemCategoryFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // The categories endpoint owns normalization, case-insensitive deduplication,
  // and sorting so every consumer receives the same canonical list.
  const {
    data: categoryOptions = [],
    isError,
    isLoading,
  } = useGetMenuItemCategoriesQuery();

  const newCategory = formatMenuCategory(searchValue);
  const hasExistingCategory = categoryOptions.some(
    (category) =>
      category.toLocaleLowerCase() === newCategory.toLocaleLowerCase(),
  );
  const canCreateCategory = Boolean(newCategory) && !hasExistingCategory;

  const selectCategory = (category: string) => {
    onValueChange(category);
    setSearchValue("");
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={invalid}
            className="w-full justify-between font-normal"
          >
            <span className="truncate">
              {value
                ? formatMenuCategory(value)
                : "Select or create a category"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-0"
        >
          <Command shouldFilter>
            <CommandInput
              value={searchValue}
              onValueChange={setSearchValue}
              placeholder="Search or create a category..."
            />
            <CommandList>
              {isLoading && (
                <CommandItem disabled>Loading categories...</CommandItem>
              )}

              {!isLoading && categoryOptions.length > 0 && (
                <CommandGroup heading="Existing categories">
                  {categoryOptions.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => selectCategory(category)}
                    >
                      <Check
                        className={
                          formatMenuCategory(value).toLocaleLowerCase() ===
                          category.toLocaleLowerCase()
                            ? "opacity-100"
                            : "opacity-0"
                        }
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {canCreateCategory && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      value={`create ${newCategory}`}
                      onSelect={() => selectCategory(newCategory)}
                    >
                      <Plus />
                      Create &ldquo;{newCategory}&rdquo;
                    </CommandItem>
                  </CommandGroup>
                </>
              )}

              {!isLoading &&
                !canCreateCategory &&
                categoryOptions.length === 0 && (
                  <CommandEmpty>
                    No categories yet. Type one above to create it.
                  </CommandEmpty>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {invalid ? (
        <FieldError errors={getErrorMessages(error)} />
      ) : (
        <FieldDescription>
          {isError
            ? "Categories could not be loaded. You can still create a new one."
            : "Select an existing category or type a new one. New categories are saved with this menu item."}
        </FieldDescription>
      )}
    </>
  );
};

export default MenuItemCategoryField;
