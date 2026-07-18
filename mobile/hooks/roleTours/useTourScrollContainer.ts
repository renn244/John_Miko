import {
  useRoleTour,
  type RoleTourScrollConfig,
} from "@/context/RoleTourContext";
import type { RoleTourTargetId } from "@/lib/roleTourDefinitions";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from "react-native";

export type TourScrollViewProps = {
  ref: React.RefObject<ScrollView | null>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle: 16;
};

export function useTourScrollContainer(targetIds: readonly RoleTourTargetId[]) {
  const { registerScrollContainer } = useRoleTour();
  const scrollRef = useRef<ScrollView | null>(null);
  const scrollOffset = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  }, []);

  const scrollConfig = useMemo<RoleTourScrollConfig>(
    () => ({
      scrollRef,
      getCurrentScrollOffset: () => scrollOffset.current,
    }),
    [],
  );

  useEffect(
    () => registerScrollContainer(targetIds, scrollConfig),
    [registerScrollContainer, scrollConfig, targetIds],
  );

  return {
    scrollViewProps: {
      ref: scrollRef,
      onScroll,
      scrollEventThrottle: 16,
    } satisfies TourScrollViewProps,
  };
}
