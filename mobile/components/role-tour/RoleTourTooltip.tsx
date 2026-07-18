import type { TooltipProps } from "@wrack/react-native-tour-guide";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const CARD_WIDTH = 328;
const INITIAL_CARD_HEIGHT = 248;
const SCREEN_MARGIN = 16;
const TARGET_GAP = 16;

type RoleTourTooltipProps = TooltipProps & {
  details?: string[];
  chapterLabel?: string;
  stepNumber?: number;
  totalGuideSteps?: number;
  isFinalGuideStep?: boolean;
  onPreviousChapter?: () => void;
};

export default function RoleTourTooltip({
  title,
  description,
  details = [],
  chapterLabel,
  stepNumber,
  totalGuideSteps,
  isFinalGuideStep,
  onPreviousChapter,
  position,
  targetHeight = 0,
  targetWidth = 0,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  screenWidth = 0,
  screenHeight = 0,
  insets = { top: 0, bottom: 0, left: 0, right: 0 },
}: RoleTourTooltipProps) {
  const [cardHeight, setCardHeight] = useState(INITIAL_CARD_HEIGHT);
  const availableWidth = Math.max(0, screenWidth - insets.left - insets.right - SCREEN_MARGIN * 2);
  const width = Math.min(CARD_WIDTH, availableWidth || CARD_WIDTH);
  const targetCenter = position.x + targetWidth / 2;
  const minLeft = insets.left + SCREEN_MARGIN;
  const maxLeft = Math.max(minLeft, screenWidth - insets.right - width - SCREEN_MARGIN);
  const left = Math.max(minLeft, Math.min(targetCenter - width / 2, maxLeft));

  const belowTop = position.y + targetHeight + TARGET_GAP;
  const safeTop = insets.top + SCREEN_MARGIN;
  const safeBottom = screenHeight - insets.bottom - SCREEN_MARGIN;
  const maxTop = Math.max(safeTop, safeBottom - cardHeight);
  const top =
    belowTop + cardHeight <= safeBottom
      ? belowTop
      : Math.max(safeTop, Math.min(position.y - cardHeight - TARGET_GAP, maxTop));

  const isLastStep = isFinalGuideStep ?? currentStep === totalSteps - 1;
  const backAction = currentStep > 0 ? onPrev : onPreviousChapter;
  const displayStepNumber = stepNumber ?? currentStep + 1;
  const displayTotalSteps = totalGuideSteps ?? totalSteps;

  return (
    <View pointerEvents="box-none" className="absolute inset-0">
      <View
        onLayout={({ nativeEvent }) => setCardHeight(nativeEvent.layout.height)}
        style={{ left, top, width }}
        className="absolute rounded-2xl border border-neutral-dark-2 bg-neutral-dark-1 p-5 shadow-lg"
      >
        {chapterLabel ? (
          <Text className="mb-1 font-sans-semibold text-sm uppercase tracking-wide text-primary-light">
            {chapterLabel}
          </Text>
        ) : null}
        <View className="flex-row items-start justify-between gap-4">
          <Text className="flex-1 font-sans-bold text-xl text-white">{title}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip role guide"
            hitSlop={6}
            onPress={onSkip}
            className="h-10 items-center justify-center rounded-md bg-neutral-dark-2 px-4"
          >
            <Text className="font-sans-semibold text-base text-white">Skip</Text>
          </Pressable>
        </View>

        <Text className="mt-2 text-base leading-5 text-neutral-soft-grey-1">{description}</Text>

        {details.length > 0 ? (
          <View className="mt-3 gap-1">
            {details.map((detail) => (
              <View key={detail} className="flex-row gap-2">
                <Text className="font-sans-bold text-base leading-5 text-primary-light">{"\u2022"}</Text>
                <Text className="flex-1 text-sm leading-5 text-neutral-soft-grey-1">{detail}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="mt-4 flex-row items-center justify-between gap-3 border-t border-neutral-dark-2 pt-3">
          <View className="rounded-md bg-neutral-dark-2 px-2 py-1">
            <Text className="font-sans-semibold text-base text-white">
              Step {displayStepNumber} of {displayTotalSteps}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {backAction ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous guide step"
                onPress={backAction}
                className="h-10 items-center justify-center rounded-md bg-neutral-dark-2 px-4"
              >
                <Text className="font-sans-semibold text-base text-white">Back</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isLastStep ? "Finish role guide" : "Next guide step"}
              onPress={onNext}
              className="h-10 items-center justify-center rounded-md bg-primary px-4"
            >
              <Text className="font-sans-semibold text-base text-white">
                {isLastStep ? "Done" : "Next"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
