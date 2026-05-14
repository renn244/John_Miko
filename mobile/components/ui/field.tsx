import { useMemo, type ComponentProps } from "react";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Label } from "./Label";

const fieldStyles = tv({
  base: "w-full gap-2",
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

type FieldProps = {
  className?: string;
  orientation?: "vertical" | "horizontal";
} & ComponentProps<typeof View>;

const Field = ({ className, orientation = "vertical", ...props }: FieldProps) => {
  return (
    <View className={fieldStyles({ orientation, className })} {...props} />
  );
};

const FieldSet = ({ className, ...props }: ComponentProps<typeof View>) => {
  return <View className={twMerge("gap-5", className)} {...props} />;
};

const FieldGroup = ({ className, ...props }: ComponentProps<typeof View>) => {
  return <View className={twMerge("gap-4", className)} {...props} />;
};

const FieldContent = ({ className, ...props }: ComponentProps<typeof View>) => {
  return <View className={twMerge("gap-2", className)} {...props} />;
};

const FieldLabel = ({ className, ...props }: ComponentProps<typeof Label>) => {
  return <Label className={twMerge("text-lg", className)} {...props} />;
};

const FieldTitle = ({ className, ...props }: ComponentProps<typeof Text>) => {
  return (
    <Text className={twMerge("text-lg font-sans-semibold text-neutral-dark-1", className)} {...props} />
  );
};

const FieldLegend = ({ className, ...props }: ComponentProps<typeof Text>) => {
  return (
    <Text className={twMerge("text-base font-sans-semibold text-neutral-dark-1", className)} {...props} />
  );
};

const FieldDescription = ({ className, ...props }: ComponentProps<typeof Text>) => {
  return (
    <Text className={twMerge("text-base text-neutral-grey-1", className)} {...props} />
  );
};

type FieldErrorProps = ComponentProps<typeof Text> & {
  errors?: Array<{ message?: string } | undefined>;
};

const FieldError = ({ className, children, errors, ...props }: FieldErrorProps) => {
  const content = useMemo(() => {
    if (children) return children;

    if (!errors?.length) return null;

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return uniqueErrors
      .map((error) => error?.message)
      .filter(Boolean)
      .join("\n");
  }, [children, errors]);

  if (!content) return null;

  return (
    <Text className={twMerge("text-base text-system-red", className)} {...props}>
      {content}
    </Text>
  );
};

const FieldSeparator = ({ className, ...props }: ComponentProps<typeof View>) => {
  return <View className={twMerge("h-px w-full bg-neutral-soft-grey-1", className)} {...props} />;
};

export {
    Field, FieldContent, FieldDescription,
    FieldError,
    FieldGroup, FieldLabel, FieldLegend,
    FieldSeparator,
    FieldSet, FieldTitle
};

