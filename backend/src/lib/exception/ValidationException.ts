import { HttpException } from "@nestjs/common";

type ValidationError = {
    field: string;
    message: string[];
};

export class ValidationException extends HttpException {
    constructor(error: ValidationError) {
        super({ 
            message: "Validation failed",
            errors: [error],
        }, 400);
    }
}