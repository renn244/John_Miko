import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { toDateOnly } from "../utils/date.util";

export function isNotPastDate(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNotPastDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: Date | string, args: ValidationArguments) {
                    const currentDate = toDateOnly(new Date(Date.now()));
                    const bookingDate = toDateOnly(value);

                    return bookingDate >= currentDate;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} cannot be in the past`;
                }
            },
        })
    }
}
