import {
    clearSessionFormDraft,
    useSessionFormDraft,
    type UseSessionFormDraftOptions,
} from "@/hooks/useSessionFormDraft";
import type { BookingStep, multiStepBookingFormSchema } from "../forms/MultiStepBookingForm";

export const BOOKING_DRAFT_STORAGE_KEY = "guest-booking-draft";

export type BookingDraftMeta = {
    accommodationId: string;
    step: BookingStep;
};

type UseBookingSessionDraftOptions = Omit<
    UseSessionFormDraftOptions<multiStepBookingFormSchema, BookingDraftMeta>,
    "storageKey"
>;

export const clearBookingDraft = () => clearSessionFormDraft(BOOKING_DRAFT_STORAGE_KEY);

export const useBookingSessionDraft = (options: UseBookingSessionDraftOptions) =>
    useSessionFormDraft({
        ...options,
        storageKey: BOOKING_DRAFT_STORAGE_KEY,
    });
