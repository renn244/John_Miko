import type { ExceptionResponse } from "@/types/exceptionResponse.types";
import type { FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

export class ValidationError extends Error {
    response: ExceptionResponse;
    constructor(response: ExceptionResponse) {
        super(response.message || "Validation failed");
        this.response = response;
    }
}

export function handleNestError<T extends FieldValues>(
    error: ExceptionResponse,
    setError: UseFormSetError<T>,
) {
    if(error.errors) {
        const fieldErrors = error.errors;
        fieldErrors.forEach((fieldError) => {
            fieldError.message.map((message) => setError(fieldError.field as any, { 
                type: 'manual', message: message || "Invalid Input"
            }));   
        })
    } else if(error.message) {
        toast.error(error.message, {
            description: "Please follow the instructions to correct the errors.",
        })
    }
}