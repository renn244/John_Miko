import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { toDateOnly } from '../utils/date.util';

export function isAtLeastThreeDaysAhead(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isAtLeastThreeDaysAhead',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: Date | string) {
                    const earliestDate = toDateOnly(new Date(Date.now()));
                    earliestDate.setUTCDate(earliestDate.getUTCDate() + 3);
                    return toDateOnly(value) >= earliestDate;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be at least 3 days ahead`;
                },
            },
        });
    };
}
