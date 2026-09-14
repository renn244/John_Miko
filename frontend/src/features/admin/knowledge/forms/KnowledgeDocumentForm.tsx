import KnowledgeDocumentToolbar from "@/features/admin/knowledge/components/KnowledgeDocumentToolbar";
import KnowledgeEditor from "@/features/admin/knowledge/components/KnowledgeEditor";
import {
    KnowledgeDocumentSchema,
    type KnowledgeDocumentFormValues,
} from "@/features/admin/knowledge/forms/knowledgeDocument.schema";
import type {
    KnowledgeDocument,
    KnowledgeDocumentInput,
} from "@/features/admin/knowledge/types/knowledge.type";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

type KnowledgeDocumentFormProps = {
    document: KnowledgeDocument | undefined;
    isLoading: boolean;
    isBusy: boolean;
    onSaveDraft: (data: KnowledgeDocumentInput) => Promise<void>;
    onPublish: (data: KnowledgeDocumentInput) => Promise<void>;
    onUnpublish: () => Promise<void>;
    onDeleteRequest: () => void;
};

const getDefaultValues = (
    document?: KnowledgeDocument,
): KnowledgeDocumentFormValues => ({
    title: document?.title ?? "",
    category: document?.category ?? "General",
    contentHtml: document?.contentHtml ?? "<p></p>",
    contentText: document?.contentText ?? "",
});

const KnowledgeDocumentForm = ({
    document,
    isLoading,
    isBusy,
    onSaveDraft,
    onPublish,
    onUnpublish,
    onDeleteRequest,
}: KnowledgeDocumentFormProps) => {
    const form = useForm<KnowledgeDocumentFormValues>({
        resolver: zodResolver(KnowledgeDocumentSchema),
        defaultValues: getDefaultValues(document),
    });
    const {
        control,
        formState: { errors, isDirty },
        handleSubmit,
        reset,
        setValue,
    } = form;

    useEffect(() => {
        reset(getDefaultValues(document));
    }, [document, reset]);

    if (isLoading) {
        return (
            <div className="min-h-[470px] animate-pulse rounded-xl bg-muted/40" />
        );
    }

    return (
        <FormProvider {...form}>
            <form
                className="min-w-0 space-y-4 xl:h-full xl:overflow-y-auto xl:pr-1"
                onSubmit={handleSubmit(onSaveDraft)}
            >
                <Card className="gap-4 p-4 md:p-5">
                    <KnowledgeDocumentToolbar
                        isPublished={document?.isPublished ?? false}
                        isExistingDocument={Boolean(document)}
                        isDirty={isDirty}
                        isBusy={isBusy}
                        onDeleteRequest={onDeleteRequest}
                        onSaveDraft={() => void handleSubmit(onSaveDraft)()}
                        onPublish={() => void handleSubmit(onPublish)()}
                        onUnpublish={() => void onUnpublish()}
                    />

                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
                        <Controller
                            name="title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="grid gap-2"
                                >
                                    <FieldLabel htmlFor="knowledge-title">
                                        Title
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="knowledge-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. Pool rules and operating hours"
                                        maxLength={160}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="category"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="grid gap-2"
                                >
                                    <FieldLabel htmlFor="knowledge-category">
                                        Category
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="knowledge-category"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="General"
                                        maxLength={80}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </Card>

                <Controller
                    name="contentHtml"
                    control={control}
                    render={({ field }) => (
                        <KnowledgeEditor
                            value={field.value}
                            onChange={({ contentHtml, contentText }) => {
                                field.onChange(contentHtml);
                                setValue("contentText", contentText, {
                                    shouldDirty: true,
                                });
                            }}
                        />
                    )}
                />

                {errors.contentText && (
                    <FieldError errors={[errors.contentText]} />
                )}
            </form>
        </FormProvider>
    );
};

export default KnowledgeDocumentForm;
