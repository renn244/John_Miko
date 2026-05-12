export type ValidationError = {
    field: string;
    message: string[];
}

export type ExceptionResponse = {
    statusCode: number;
    message: string ;
    errors?: ValidationError[];
    timeStamp: string;
}