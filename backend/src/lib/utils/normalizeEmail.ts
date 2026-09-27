// Keep this in sync with PostgreSQL btrim() in the email-normalization migration.
export const normalizeEmail = (email: string): string =>
  email.replace(/^ +| +$/g, '').toLowerCase();
