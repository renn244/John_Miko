import { registerDecorator } from "class-validator";


export function isCapitalized(validationOptions?: any) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCapitalized',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string' || value.length === 0) {
                        return false;
                    }

                    const firstWord = value.split(' ')[0]; // so that it only checks the first word of the string
                    const firstLetter = firstWord.charAt(0);
                    const restLetter = firstWord.slice(1);

                    return firstLetter === firstLetter.toUpperCase() && 
                        restLetter === restLetter.toLowerCase();
                },
                defaultMessage() {
                    return `${propertyName} must be capitalized`;
                }
            }
        })
    }
}