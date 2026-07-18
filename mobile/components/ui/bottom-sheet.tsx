import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function AppBottomSheet({ open, onClose, title, children }: AppBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const isPresented = useRef(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (open) {
      isPresented.current = true;
      sheetRef.current?.present();
      return;
    }

    if (isPresented.current) {
      sheetRef.current?.dismiss();
    }
  }, [open]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.35}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: "#B0B8BF" }}
      onDismiss={() => {
        isPresented.current = false;
        onClose();
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom }}
      >
        <View className="gap-5">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-xl text-neutral-dark-1">{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Close ${title}`}
              hitSlop={4}
              className="size-10 items-center justify-center rounded-full bg-neutral-soft-grey-3"
              onPress={() => sheetRef.current?.dismiss()}
            >
              <X size={19} color="#1F2933" />
            </Pressable>
          </View>
          {children}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
