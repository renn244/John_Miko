import z from 'zod';

export const passwordRules = [
    { test: (value: string) => value.length >= 8, label: 'At least 8 characters' },
    { test: (value: string) => /[a-z]/.test(value), label: 'Lowercase letter' },
    { test: (value: string) => /[A-Z]/.test(value), label: 'Uppercase letter' },
    { test: (value: string) => /\d/.test(value), label: 'Number' },
    { test: (value: string) => /[^A-Za-z0-9]/.test(value), label: 'Special character' },
] as const;

export const accountPasswordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');
