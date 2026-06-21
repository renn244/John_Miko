import Logo from "@/assets/app/logo/logo.svg";
import CustomSafeArea from "@/components/ui/CustomSafeAreaView";
import type { PropsWithChildren, ReactNode } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { twMerge } from "tailwind-merge";

type AuthScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  cue?: string;
  cueIcon?: ReactNode;
  cueTone?: "neutral" | "success" | "info" | "warning" | "danger";
  brand?: string;
  headerSlot?: ReactNode;
  showHeader?: boolean;
  contentClassName?: string;
  scrollContentClassName?: string;
}>;

export default function AuthScreenShell({
  title,
  subtitle,
  cue,
  cueIcon,
  cueTone = "neutral",
  brand = "John Miko's",
  headerSlot,
  showHeader = true,
  contentClassName,
  scrollContentClassName,
  children,
}: AuthScreenShellProps) {
  const cueClassName = {
    neutral: "border-neutral-soft-grey-2 bg-white",
    success: "border-secondary-green-light bg-secondary-green-light/35",
    info: "border-secondary-blue-light bg-secondary-blue-light/45",
    warning: "border-secondary-yellow-light bg-secondary-yellow-light/45",
    danger: "border-system-red/20 bg-system-red/10",
  }[cueTone];

  const cueTextClassName = {
    neutral: "text-neutral-dark-2",
    success: "text-secondary-green-dark",
    info: "text-primary-dark",
    warning: "text-neutral-dark-1",
    danger: "text-secondary-red-dark",
  }[cueTone];

  return (
    <CustomSafeArea className="bg-neutral-soft-grey-3">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingVertical: 32,
        }}
        bottomOffset={32}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className={twMerge(
            "w-full px-6",
            scrollContentClassName
          )}
        >
          <View
            className={twMerge(
              "mx-auto w-full max-w-sm gap-6",
              contentClassName
            )}
          >
            <View className="gap-8">
              {showHeader ? (
                <View className="gap-5">
                  <View className="flex-row items-center gap-2">
                    <Logo height={18} width={18} />
                    <Text className="font-sans-bold text-xl text-primary">
                      {brand}
                    </Text>
                  </View>

                  <View className="gap-3">
                    {cue ? (
                      <View className={twMerge("self-start flex-row items-center gap-1.5 rounded-full border px-3 py-1", cueClassName)}>
                        {cueIcon}
                        <Text className={twMerge("font-sans-semibold text-sm", cueTextClassName)}>
                          {cue}
                        </Text>
                      </View>
                    ) : null}

                    <View className="gap-1">
                      <Text className="font-sans-bold text-2xl text-neutral-dark-1">
                        {title}
                      </Text>
                      {subtitle ? (
                        <Text className="text-base leading-5 text-neutral-grey-1">
                          {subtitle}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {headerSlot}
                </View>
              ) : null}

              {children}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </CustomSafeArea>
  );
}
