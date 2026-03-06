import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import handlePrismaExceptionErrors from "./prisma/PrismaExceptionHandler";
import { Prisma } from "./generated/prisma/client";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

     catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse(); 

        let status = 500;
        let message = "Unexpected Error";
        let name: string | undefined = "Internal Server Error";
        let errors: any = undefined;

        if(exception instanceof Prisma.PrismaClientKnownRequestError) {
            // handle Prisma Known Exception Exceptions
            status = 400; // Bad Request
            name = undefined;
            message = "Validation failed";

            errors = handlePrismaExceptionErrors(exception);

        } else if(exception instanceof HttpException) {
            // for http Exceptions
            const exceptionResponse = exception.getResponse() as any;

            status = exception.getStatus();

            // for validation exception
            if(typeof exceptionResponse === "object" && exceptionResponse.errors) {
                errors = exceptionResponse.errors;
            }

            if(typeof exceptionResponse === "object") {
                name = exceptionResponse.name;
                message = exceptionResponse.message;
            } else if(typeof exceptionResponse === "string") {
                message = exceptionResponse
            }
        } else {
            // have a report error to a website to observe the error
            
            this.logger.error(exception);
            message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            name,
            message,
            errors,
            timeStamp: new Date().toISOString(),
        })
    }
}