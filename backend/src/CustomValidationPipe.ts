import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if(metadata.type !== 'body') {
            return value
        }

        if(!value) {
            throw new BadRequestException("No data submitted")
        }

        // if it's not a class, return the value
        if(!metadata.metatype || !this.toValidateClass(metadata.metatype)) {
            return value
        }

        const object = plainToClass(metadata.metatype, value);

        const error = await validate(object); // would return an array of errors if there are any errors

        if(error.length > 0) {
            const errors = error.map(err => {
                return {
                    field: err.property,
                    message: Object.values(err.constraints ? err.constraints : {})
                }
            }) 

            throw new BadRequestException({
                message: "Validation failed",
                errors: errors
            })
        }

        // if there is no errors, return the value that is originally passed
        return value;
    }

    // would return false if the metatype is a string, boolean, number, array, or object
    private toValidateClass(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype); // would return true if it includes so we need "!"
    }
}