import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import { useForm, type DefaultValues, type FieldValues, type UseFormProps } from "react-hook-form";

const SESSION_DRAFT_VERSION = 1;

type SessionFormDraft<TValues extends FieldValues, TMeta> = {
    version: typeof SESSION_DRAFT_VERSION;
    values: TValues;
    meta: TMeta;
};

export type UseSessionFormDraftOptions<TValues extends FieldValues, TMeta> = {
    storageKey: string;
    formOptions: Omit<UseFormProps<TValues>, "defaultValues">;
    defaultValues: DefaultValues<TValues>;
    initialMeta: TMeta;
    isDraftValid: (meta: TMeta) => boolean;
    restoreValues?: (savedValues: TValues, freshValues: DefaultValues<TValues>) => DefaultValues<TValues>;
};

const getSessionStorage = () => {
    if (typeof window === "undefined") return null;

    try {
        return window.sessionStorage;
    } catch {
        return null;
    }
};

const isSessionFormDraft = <TValues extends FieldValues, TMeta>(value: unknown): value is SessionFormDraft<TValues, TMeta> => {
    if (!value || typeof value !== "object") return false;

    const draft = value as Partial<SessionFormDraft<TValues, TMeta>>;
    return draft.version === SESSION_DRAFT_VERSION && "values" in draft && "meta" in draft;
};

export const clearSessionFormDraft = (storageKey: string) => {
    getSessionStorage()?.removeItem(storageKey);
};

const readSessionFormDraft = <TValues extends FieldValues, TMeta>(
    storageKey: string,
    isDraftValid: (meta: TMeta) => boolean,
): SessionFormDraft<TValues, TMeta> | null => {
    const storage = getSessionStorage();
    if (!storage) return null;

    try {
        const rawDraft = storage.getItem(storageKey);
        if (!rawDraft) return null;

        const draft: unknown = JSON.parse(rawDraft);
        if (!isSessionFormDraft<TValues, TMeta>(draft) || !isDraftValid(draft.meta)) {
            storage.removeItem(storageKey);
            return null;
        }

        return draft;
    } catch {
        storage.removeItem(storageKey);
        return null;
    }
};

const writeSessionFormDraft = <TValues extends FieldValues, TMeta>(
    storageKey: string,
    values: TValues,
    meta: TMeta,
) => {
    const storage = getSessionStorage();
    if (!storage) return;

    try {
        storage.setItem(storageKey, JSON.stringify({
            version: SESSION_DRAFT_VERSION,
            values,
            meta,
        } satisfies SessionFormDraft<TValues, TMeta>));
    } catch {
        // Draft recovery is optional. A full or unavailable session store must not break the booking flow.
    }
};

export const useSessionFormDraft = <TValues extends FieldValues, TMeta>({
    storageKey,
    formOptions,
    defaultValues,
    initialMeta,
    isDraftValid,
    restoreValues,
}: UseSessionFormDraftOptions<TValues, TMeta>) => {
    const [savedDraft] = useState(() => readSessionFormDraft<TValues, TMeta>(storageKey, isDraftValid));
    const [initialValues] = useState<DefaultValues<TValues>>(() =>
        savedDraft
            ? restoreValues?.(savedDraft.values, defaultValues) ?? savedDraft.values as DefaultValues<TValues>
            : defaultValues,
    );
    const [meta, setMetaState] = useState<TMeta>(() => savedDraft?.meta ?? initialMeta);
    const metaRef = useRef(meta);

    const form = useForm<TValues>({
        ...formOptions,
        defaultValues: initialValues,
    });

    const persist = useCallback((values: TValues, nextMeta: TMeta) => {
        writeSessionFormDraft(storageKey, values, nextMeta);
    }, [storageKey]);

    const setMeta = useCallback((nextMeta: SetStateAction<TMeta>) => {
        const resolvedMeta = typeof nextMeta === "function"
            ? (nextMeta as (current: TMeta) => TMeta)(metaRef.current)
            : nextMeta;

        metaRef.current = resolvedMeta;
        setMetaState(resolvedMeta);
        persist(form.getValues(), resolvedMeta);
    }, [form, persist]);

    const clearDraft = useCallback(() => {
        clearSessionFormDraft(storageKey);
    }, [storageKey]);

    useEffect(() => {
        const unsubscribe = form.subscribe({
            formState: { values: true },
            callback: ({ values }) => persist(values, metaRef.current),
        });

        return unsubscribe;
    }, [form, persist]);

    return { form, meta, setMeta, clearDraft };
};
