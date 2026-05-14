import { ComponentProps, ComponentRef, forwardRef, useState } from "react";
import { TextInput, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const inputStyles = tv({
  base: "w-full border bg-neutral-soft-grey-3 text-neutral-dark-1 font-sans",
  variants: {
    size: {
      default: "h-12 px-4 text-xl rounded-xl",
      sm: "h-10 px-3 text-lg rounded-lg",
      lg: "h-14 px-5 text-xl rounded-xl",
    },
    state: {
      default: "border-neutral-soft-grey-1",
      focused: "border-system-blue bg-white",
      invalid: "border-system-red bg-white",
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

const ringStyles = tv({
  base: "border-2 border-transparent",
  variants: {
    size: {
      default: "rounded-[14px]",
      sm: "rounded-[10px]",
      lg: "rounded-[16px]",
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

type InputProps = {
  className?: string;
  invalid?: boolean;
  size?: "default" | "sm" | "lg";
};

const Input = forwardRef<
  ComponentRef<typeof TextInput>,
  InputProps & ComponentProps<typeof TextInput>
>(({ className, invalid, size = "default", ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const state = invalid ? "invalid" : focused ? "focused" : "default";
  const isEditable = props.editable !== false;
  const backgroundColor = state === "default" ? "#FAFAFB" : "#FFFFFF";

  return (
    <View className={ringStyles({ state, size })}>
      <TextInput
        ref={ref}
        className={twMerge(
          inputStyles({ state, size }),
          !isEditable ? "opacity-50" : "",
          className
        )}
        style={[{ backgroundColor }, props.style]}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        placeholderTextColor={props.placeholderTextColor ?? "#9FA8B1"}
        {...props}
      />
    </View>
  );
});
Input.displayName = "Input";

export { Input, InputProps, inputStyles, ringStyles };

