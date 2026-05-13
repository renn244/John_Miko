import { Check, ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { tv } from "tailwind-variants";

const input = tv({
  base: "w-full bg-[#F5F6F7]",
  variants: {
    color: {
      default: "",
      destructive: "border-2 border-red-500",
    },
    focused: {
      true: "border-2 border-system-blue bg-white",
      false: "border-2 border-neutral-soft-grey-1",
    },
    size: {
      default: "h-12 px-4 rounded-xl",
      medium: "h-10 px-3 rounded-lg",
      small: "h-8 px-2 rounded-md",
    },
  },
  defaultVariants: {
    focused: false,
    size: "default",
  },
});

const ring = tv({
  variants: {
    size: {
      default: "rounded-[14px]",
      medium: "rounded-[10px]",
      small: "rounded-[8px]",
    },
    focused: {
      true: "border-2 border-system-blue/30",
      false: "border-2 border-transparent",
    }
  },
  defaultVariants: {
    size: "default",
    focused: false,
  }
})

export type SelectOption<T extends string | number = string> = {
  label: string;
  value: T;
};

export type CustomSelectProps<T extends string | number = string> = {
  options: SelectOption<T>[];
  value?: T;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  size?: "default" | "medium" | "small";
};

export function CustomSelect<T extends string | number = string>({
  options,
  value: controlledValue,
  onValueChange,
  placeholder = "Select an option",
  size = "default",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(controlledValue);

  const value = controlledValue ?? internalValue;
  const selected = options.find(o => o.value === value);

  const handleSelect = (val: T) => {
    setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <>
      <View className={ring({ focused: open, size })}>
        <Pressable
        onPress={() => setOpen(true)}
        className={input({ focused: open, size })}
        >
          <View className="flex-1 flex-row items-center justify-between rounded-xl">
            <Text className={`${selected ? "text-neutral-900" : "text-neutral-400"} text-xl`}>
              {selected?.label ?? placeholder}
            </Text>

            {open ? (
              <ChevronUp color="#DCDFE3" width={24} height={24} />
            ) : (
              <ChevronDown color="#DCDFE3" width={24} height={24} />
            )}
          </View>
        </Pressable>
      </View>

      <Modal 
      transparent 
      onRequestClose={() => setOpen(false)}
      visible={open} animationType="fade">

        <Pressable
        className="flex-1 bg-black/30 blur-2xl"
        onPress={() => setOpen(false)}
        />

        <View className="absolute bottom-[35%] w-full p-4">
          <View className="bg-white rounded-3xl shadow-lg overflow-hidden px-6 py-3">
            <FlatList<SelectOption<T>>
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item, index }) => {
                const active = item.value === value;
                const isLast = index === options.length - 1;

                return (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    className={`py-3 flex-row items-center justify-between ${isLast ? "border-0" : "border-b border-neutral-soft-grey-1"}`}
                  >
                    <Text
                      className={`font-sans tracking-wide text-xl leading-6 ${
                        active
                          ? "text-primary font-semibold"
                          : "text-neutral-900"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {active && (
                      <View className="size-6 flex justify-center items-center rounded-full bg-primary">
                        <Check color="#FFFFFF" width={16} height={16} />
                      </View>
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default CustomSelect;
