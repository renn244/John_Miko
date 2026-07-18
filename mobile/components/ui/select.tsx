import { Check, ChevronDown, X } from "lucide-react-native";
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder: string;
  size: "default" | "sm";
  invalid?: boolean;
  surface: "soft" | "white";
  labelMap: Map<string, string>;
};

const SelectContext = createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select");
  }
  return context;
};

const triggerStyles = tv({
  base: "w-full border text-neutral-dark-1 font-sans",
  variants: {
    size: {
      default: "h-12 px-4 rounded-xl",
      sm: "h-10 px-3 rounded-lg",
    },
    state: {
      default: "border-neutral-soft-grey-1",
      focused: "border-system-blue bg-white",
      invalid: "border-system-red bg-white",
    },
    surface: {
      soft: "bg-neutral-soft-grey-3",
      white: "bg-white",
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
    surface: "soft",
  },
});

const valueTextStyles = tv({
  base: "text-neutral-dark-1",
  variants: {
    size: {
      default: "text-xl",
      sm: "text-lg",
    },
    placeholder: {
      true: "text-neutral-grey-2",
      false: "",
    },
  },
  defaultVariants: {
    size: "default",
    placeholder: false,
  },
});

const ringStyles = tv({
  base: "border-2 border-transparent",
  variants: {
    size: {
      default: "rounded-[14px]",
      sm: "rounded-[10px]",
    },
    state: {
      default: "",
      focused: "border-system-blue/30",
      invalid: "border-system-red/20",
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: "default" | "sm";
  invalid?: boolean;
  surface?: "soft" | "white";
  children: ReactNode;
};

const collectLabels = (node: ReactNode, map: Map<string, string>) => {
  const children = Array.isArray(node) ? node : [node];
  children.forEach((child) => {
    if (!child || typeof child !== "object" || !("props" in child)) {
      return;
    }

    const element = child as { props?: { value?: string; children?: ReactNode } };
    if (element.props?.value && typeof element.props.children === "string") {
      map.set(element.props.value, element.props.children);
    }

    if (element.props?.children) {
      collectLabels(element.props.children, map);
    }
  });
};

const Select = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  size = "default",
  invalid,
  surface = "soft",
  children,
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  const labelMap = useMemo(() => {
    const map = new Map<string, string>();
    collectLabels(children, map);
    return map;
  }, [children]);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        placeholder,
        size,
        invalid,
        surface,
        labelMap,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

type SelectTriggerProps = ComponentProps<typeof Pressable> & {
  className?: string;
  leftIcon?: ReactNode;
};

const SelectTrigger = ({ className, leftIcon, ...props }: SelectTriggerProps) => {
  const { open, setOpen, size, invalid, surface } = useSelect();
  const state = invalid ? "invalid" : open ? "focused" : "default";
  const chevronSize = size === "sm" ? 18 : 20;

  return (
    <View className={ringStyles({ state, size })}>
      <Pressable
        className={twMerge(triggerStyles({ state, size, surface }), className)}
        onPress={() => setOpen(true)}
        {...props}
      >
        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            {leftIcon}
            <SelectValue />
          </View>
          <ChevronDown width={chevronSize} height={chevronSize} color="#9FA8B1" />
        </View>
      </Pressable>
    </View>
  );
};

type SelectValueProps = {
  placeholder?: string;
};

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value, labelMap, placeholder: contextPlaceholder, size } = useSelect();
  const label = value ? labelMap.get(value) : undefined;
  const display = label ?? placeholder ?? contextPlaceholder;
  const isPlaceholder = !label;

  return (
    <Text className={valueTextStyles({ size, placeholder: isPlaceholder })}>
      {display}
    </Text>
  );
};

type SelectContentProps = ComponentProps<typeof View> & {
  className?: string;
  title?: string;
};

const SelectContent = ({ className, title, children }: SelectContentProps) => {
  const { open, setOpen } = useSelect();

  if (!open) {
    return null;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1 items-center justify-center px-4">
        <Pressable className="absolute inset-0 bg-black/30" onPress={() => setOpen(false)} />
        <View
          className={twMerge(
            "w-full max-w-[360px] overflow-hidden rounded-3xl bg-white px-6 py-5 shadow-lg",
            className,
          )}
        >
          {title ? (
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="font-sans-bold text-xl text-neutral-dark-1">{title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Close ${title}`}
                hitSlop={4}
                className="size-10 items-center justify-center rounded-full"
                onPress={() => setOpen(false)}
              >
                <X size={20} color="#4D5963" />
              </Pressable>
            </View>
          ) : null}
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};

type SelectItemProps = Omit<ComponentProps<typeof Pressable>, "children"> & {
  value: string;
  className?: string;
  children: ReactNode;
};

const SelectItem = ({ value, className, children, ...props }: SelectItemProps) => {
  const { value: selectedValue, onValueChange, setOpen } = useSelect();
  const active = value === selectedValue;

  return (
    <Pressable
      onPress={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
      className={twMerge(
        "py-3 flex-row items-center justify-between",
        className
      )}
      {...props}
    >
      <Text className={twMerge("text-lg", active ? "text-primary font-sans-semibold" : "text-neutral-dark-1")}>
        {children}
      </Text>
      {active ? (
        <View className="size-6 flex items-center justify-center rounded-full bg-primary">
          <Check color="#FFFFFF" width={16} height={16} />
        </View>
      ) : null}
    </Pressable>
  );
};

const SelectGroup = ({ className, ...props }: ComponentProps<typeof View>) => {
  return <View className={twMerge("gap-2", className)} {...props} />;
};

const SelectLabel = ({ className, ...props }: ComponentProps<typeof Text>) => {
  return <Text className={twMerge("text-base text-neutral-grey-1", className)} {...props} />;
};

const SelectSeparator = ({ className, ...props }: ComponentProps<typeof View>) => {
  return <View className={twMerge("h-px w-full bg-neutral-soft-grey-1", className)} {...props} />;
};

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue
};
