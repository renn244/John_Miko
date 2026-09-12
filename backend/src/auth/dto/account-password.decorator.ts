import { applyDecorators } from '@nestjs/common';
import { Matches, MinLength } from 'class-validator';

/** Keep Settings and reset endpoints aligned with the reset-form policy. */
export const AccountPassword = () => applyDecorators(
    MinLength(8, { message: 'Password must be at least 8 characters' }),
    Matches(/[a-z]/, { message: 'Password must contain a lowercase letter' }),
    Matches(/[A-Z]/, { message: 'Password must contain an uppercase letter' }),
    Matches(/\d/, { message: 'Password must contain a number' }),
    Matches(/[^A-Za-z0-9]/, { message: 'Password must contain a special character' }),
);
