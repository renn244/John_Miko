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

            const errorTypes: Record<string, string> = {};
            
            fieldError.message.forEach((message, index) => {
                // Generates keys like manualError0, manualError1, etc.
                // because error can't actually be on arrays
                errorTypes[`manual_error_${index}`] = message || "Invalid Input";
            });

            setError(fieldError.field as any, { 
                types: errorTypes // set all of it 
            });   
        })
    } else if(error.message) {
        toast.error(error.message, {
            description: "Please follow the instructions to correct the errors.",
        })
    }
}