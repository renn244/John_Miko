import RoleTourTooltip from "@/components/role-tour/RoleTourTooltip";
import {
  getRoleTourDefinition,
  getRoleTourStepCount,
  getRoleTourStepOffset,
  type RoleTourTargetId,
} from "@/lib/roleTourDefinitions";
import { hasSeenRoleTour, setSeenRoleTour } from "@/lib/roleTourStorage";
import type { AuthUser } from "@/types/auth.type";
import {
  TourGuideOverlay,
  TourGuideProvider,
  useTourGuide,
  type MeasurableRef,
  type ScrollableRef,
} from "@wrack/react-native-tour-guide";
import { type Href, useRouter } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type RefCallback,
} from "react";

export type RoleTourTargetProps = {
  ref: RefCallback<unknown>;
};

export type RoleTourScrollConfig = {
  scrollRef: ScrollableRef;
  getCurrentScrollOffset: () => number;
};

type PendingRoleTour = {
  user: AuthUser;
  chapterIndex: number;
  initialStepIndex?: number;
};

type RoleTourContextValue = {
  targetProps: (targetId: RoleTourTargetId) => RoleTourTargetProps;
  registerScrollContainer: (
    targetIds: readonly RoleTourTargetId[],
    config: RoleTourScrollConfig,
  ) => () => void;
  requestAutoStart: (user: AuthUser) => Promise<void>;
  requestReplay: (user: AuthUser) => void;
};

const RoleTourContext = createContext<RoleTourContextValue | undefined>(undefined);

function RoleTourCoordinator({ children }: PropsWithChildren) {
  const router = useRouter();
  const { endTour, goToStep, isActive, startTour } = useTourGuide();
  const targetRefs = useRef(new Map<RoleTourTargetId, MeasurableRef>());
  const targetPropsById = useRef(new Map<RoleTourTargetId, RoleTourTargetProps>());
  const scrollConfigsByTargetId = useRef(new Map<RoleTourTargetId, RoleTourScrollConfig>());
  const autoCheckKeys = useRef(new Set<string>());
  const startingRef = useRef(false);
  const advancingChapterRef = useRef(false);
  const [targetRevision, setTargetRevision] = useState(0);
  const [pendingTour, setPendingTour] = useState<PendingRoleTour | null>(null);

  const targetProps = useCallback((targetId: RoleTourTargetId): RoleTourTargetProps => {
    const existing = targetPropsById.current.get(targetId);
    if (existing) return existing;

    const targetRef: MeasurableRef = { current: null };
    const ref: RefCallback<unknown> = (node) => {
      if (targetRef.current === node) return;
      targetRef.current = node;
      setTargetRevision((current) => current + 1);
    };
    const props = { ref };

    targetRefs.current.set(targetId, targetRef);
    targetPropsById.current.set(targetId, props);
    return props;
  }, []);

  const registerScrollContainer = useCallback(
    (targetIds: readonly RoleTourTargetId[], config: RoleTourScrollConfig) => {
      targetIds.forEach((targetId) => scrollConfigsByTargetId.current.set(targetId, config));
      setTargetRevision((current) => current + 1);

      return () => {
        targetIds.forEach((targetId) => {
          if (scrollConfigsByTargetId.current.get(targetId) === config) {
            scrollConfigsByTargetId.current.delete(targetId);
          }
        });
        setTargetRevision((current) => current + 1);
      };
    },
    [],
  );

  const requestAutoStart = useCallback(async (user: AuthUser) => {
    const definition = getRoleTourDefinition(user.role);
    const key = `${user.id}:${user.role}:${definition.storageVersion}`;

    if (autoCheckKeys.current.has(key)) return;
    autoCheckKeys.current.add(key);

    try {
      if (await hasSeenRoleTour(user.id, user.role, definition.storageVersion)) return;
    } catch {
      autoCheckKeys.current.delete(key);
      return;
    }

    setPendingTour((current) => current ?? { user, chapterIndex: 0 });
  }, []);

  const requestReplay = useCallback((user: AuthUser) => {
    setPendingTour({ user, chapterIndex: 0 });
  }, []);

  const goToPreviousChapter = useCallback(() => {
    if (!pendingTour || pendingTour.chapterIndex === 0) return;

    const definition = getRoleTourDefinition(pendingTour.user.role);
    const chapterIndex = pendingTour.chapterIndex - 1;
    const previousChapter = definition.chapters[chapterIndex];

    startingRef.current = false;
    setPendingTour({
      ...pendingTour,
      chapterIndex,
      initialStepIndex: previousChapter.steps.length - 1,
    });
    endTour();
    router.replace(previousChapter.route as Href);
  }, [endTour, pendingTour, router]);

  useEffect(() => {
    if (!pendingTour || isActive || startingRef.current) return;

    const definition = getRoleTourDefinition(pendingTour.user.role);
    const chapter = definition.chapters[pendingTour.chapterIndex];
    const totalSteps = getRoleTourStepCount(definition);
    const stepOffset = getRoleTourStepOffset(definition, pendingTour.chapterIndex);
    const isLastChapter = pendingTour.chapterIndex === definition.chapters.length - 1;
    const hasReadyScrollContainer = chapter.scrollTargetIds?.every(
      (targetId) => scrollConfigsByTargetId.current.get(targetId)?.scrollRef.current,
    );
    const steps = chapter.steps.map((step, stepIndex) => {
      const scrollConfig = scrollConfigsByTargetId.current.get(step.targetId);

      return {
        ...step,
        targetRef: targetRefs.current.get(step.targetId),
        tooltipPosition: "auto" as const,
        spotlightPadding: 8,
        backdropBehavior: "none" as const,
        scrollToTarget: scrollConfig
          ? {
              scrollRef: scrollConfig.scrollRef,
              getCurrentScrollOffset: scrollConfig.getCurrentScrollOffset,
            }
          : undefined,
        onNext:
          stepIndex === chapter.steps.length - 1 && !isLastChapter
            ? () => {
                const chapterIndex = pendingTour.chapterIndex + 1;
                const nextChapter = definition.chapters[chapterIndex];

                advancingChapterRef.current = true;
                setPendingTour({ ...pendingTour, chapterIndex, initialStepIndex: 0 });
                router.replace(nextChapter.route as Href);
              }
            : undefined,
      };
    });

    if (hasReadyScrollContainer === false) return;
    if (steps.some((step) => !step.targetRef?.current)) return;

    startingRef.current = true;
    const user = pendingTour.user;

    startTour(steps, {
      tourId: `${definition.id}:${chapter.id}`,
      autoPositionTooltip: true,
      defaultBackdropBehavior: "none",
      enableBackButton: true,
      renderTooltip: (props) => (
        <RoleTourTooltip
          {...props}
          details={chapter.steps[props.currentStep]?.details}
          chapterLabel={chapter.label}
          stepNumber={stepOffset + props.currentStep + 1}
          totalGuideSteps={totalSteps}
          isFinalGuideStep={isLastChapter && props.currentStep === chapter.steps.length - 1}
          onPreviousChapter={
            pendingTour.chapterIndex > 0 && props.currentStep === 0
              ? goToPreviousChapter
              : undefined
          }
        />
      ),
      onTourEnd: () => {
        startingRef.current = false;

        if (advancingChapterRef.current) {
          advancingChapterRef.current = false;
          return;
        }

        setPendingTour(null);
        void setSeenRoleTour(user.id, user.role, definition.storageVersion).catch(() => undefined);
      },
    });

    if (pendingTour.initialStepIndex) {
      goToStep(pendingTour.initialStepIndex);
    }
  }, [goToPreviousChapter, goToStep, isActive, pendingTour, router, startTour, targetRevision]);

  const value = useMemo(
    () => ({ targetProps, registerScrollContainer, requestAutoStart, requestReplay }),
    [registerScrollContainer, requestAutoStart, requestReplay, targetProps],
  );

  return (
    <RoleTourContext.Provider value={value}>
      {children}
      <TourGuideOverlay />
    </RoleTourContext.Provider>
  );
}

export function RoleTourProvider({ children }: PropsWithChildren) {
  return (
    <TourGuideProvider>
      <RoleTourCoordinator>{children}</RoleTourCoordinator>
    </TourGuideProvider>
  );
}

export function useRoleTour() {
  const context = useContext(RoleTourContext);

  if (!context) {
    throw new Error("useRoleTour must be used within RoleTourProvider.");
  }

  return context;
}
