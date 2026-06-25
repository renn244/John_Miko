import { StyleSheet, Text, View } from 'react-native';

type ChevronStepperProps = {
  currentStepIndex: number;
};

const steps = ['Pending', 'Started', 'Done', 'Closed'];

const stepperColors = {
  active: '#0E33F3',
  complete: '#DDFBEF',
  idle: '#EEF2F6',
  divider: '#FFFFFF',
} as const;

export function ChevronStepper({ currentStepIndex }: ChevronStepperProps) {
  return (
    <View className="flex-row rounded-md border border-neutral-soft-grey-2 bg-white px-1 py-1">
      {steps.map((step, index) => {
        const isComplete = index < currentStepIndex;
        const isActive = index === currentStepIndex;
        const backgroundColor = isActive
          ? stepperColors.active
          : isComplete
            ? stepperColors.complete
            : stepperColors.idle;

        return (
          <View
            key={step}
            className="relative flex-1 items-center justify-center py-2.5"
            style={{
              backgroundColor,
              marginLeft: index === 0 ? 0 : 4,
              paddingLeft: index === 0 ? 6 : 15,
              paddingRight: index === steps.length - 1 ? 6 : 16,
              zIndex: steps.length - index,
            }}
          >
            {index > 0 ? (
              <View
                pointerEvents="none"
                style={[
                  styles.stepperNotch,
                  { borderLeftColor: stepperColors.divider },
                ]}
              />
            ) : null}
            {index < steps.length - 1 ? (
              <>
                <View
                  pointerEvents="none"
                  style={[
                    styles.stepperSeamCover,
                    { backgroundColor },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.stepperArrow,
                    { borderLeftColor: backgroundColor },
                  ]}
                />
              </>
            ) : null}
            <Text
              className={`font-sans-bold text-xs ${
                isActive
                  ? 'text-white'
                  : isComplete
                    ? 'text-secondary-green-dark'
                    : 'text-neutral-grey-1'
              }`}
              numberOfLines={1}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stepperArrow: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 18,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderTopWidth: 18,
    height: 0,
    position: "absolute",
    right: -18,
    top: 0,
    width: 0,
    zIndex: 4,
  },
  stepperSeamCover: {
    bottom: 0,
    position: "absolute",
    right: -1,
    top: 0,
    width: 3,
    zIndex: 3,
  },
  stepperNotch: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 18,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderTopWidth: 18,
    height: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 0,
    zIndex: 3,
  },
});
