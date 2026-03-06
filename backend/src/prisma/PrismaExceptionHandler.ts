import { Prisma } from "src/generated/prisma/client";

type PrismaError = Prisma.PrismaClientKnownRequestError;

type ErrorType = {
    field: string;
    message: string[];
}[];

const getMetaString = (value: unknown): string => {
    return typeof value === 'string' ? value : 'Field';
};

const handlePrismaErrorsCode = (propertyName: string | undefined, code: PrismaError['code']): string => {
    const name = propertyName ?? 'Field';

    const messageToCode: Record<string, string> = {
        'P2000': `${name} is too long. Please shorten it.`,
        'P2001': `Could not find with ${name}.`,
        'P2002': `${name} already exists.`,
        'P2003': `${name} does not exist anymore.`,
        'P2025': `${name} not found.`,
    };

    return process.env.NODE_ENV === 'production'
        ? messageToCode[code] ?? 'Database error.'
        : messageToCode[code] ?? `Unknown prisma error code: ${code}`;
};

const handlePrismaExceptionErrors = (exception: PrismaError): ErrorType => {

    if (exception.code === 'P2003') {
        const field = getMetaString(exception.meta?.field_name);
        return [{
            field,
            message: [handlePrismaErrorsCode(field, exception.code)]
        }];
    }

    if (exception.code === 'P2000') {
        const field = getMetaString(exception.meta?.column_name);
        return [{
            field,
            message: [handlePrismaErrorsCode(field, exception.code)]
        }];
    }

    if (Array.isArray(exception?.meta?.target)) {
        return exception.meta.target.map((err) => ({
            field: getMetaString(err),
            message: [handlePrismaErrorsCode(getMetaString(err), exception.code)]
        }));
    }

    const field = getMetaString(exception?.meta?.modelName);
    return [{
        field,
        message: [handlePrismaErrorsCode(field, exception.code)]
    }];
};

export default handlePrismaExceptionErrors;