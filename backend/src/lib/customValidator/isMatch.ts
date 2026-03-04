import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Custom decorator that checks if the decorated property value matches the value of another property.
 * Useful for confirming fields like passwords and confirmPassword in DTOs
 *
 * @template T - The type of the object being validated (usually inferred from the DTO class).
 * @param property - The name of the property to compare against (must be a key of type T).
 * @param validationOptions - Optional class-validator validation options.
 *
 * @returns A property decorator that registers the custom validator.
 *
 * @example
 * import { IsString } from 'class-validator';
 * import { IsMatch } from './is-match.decorator';
 * 
 * export class CreateUserDto {
 *   @IsString()
 *   password: string;
 *
 *   @IsString()
 *   @IsMatch<CreateUserDto>('password')
 *   confirmPassword: string;
 * }
 */

export function IsMatch<T=any>(property: keyof T, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsMatch',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as T)[relatedPropertyName];

                    if(!(typeof relatedValue == 'string') || !(typeof value == 'string')) {
                        args.constraints.push('TypeMismatch');
                        return false;
                    }

                    return value === relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    if(args.constraints.includes('TypeMismatch')) {
                        return `${args.property} and ${args.constraints[0]} does not match types`
                    }
                    return `${args.property} must match ${args.constraints[0]}`;
                }
            }
        })
    }
}