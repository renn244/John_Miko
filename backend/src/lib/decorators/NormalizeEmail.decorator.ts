import { Transform } from 'class-transformer';
import { normalizeEmail } from 'src/lib/utils/normalizeEmail';

/** Normalizes incoming email values before class-validator runs. */
export function NormalizeEmail(): PropertyDecorator {
  return Transform(
    ({ value }) => typeof value === 'string' ? normalizeEmail(value) : value,
    { toClassOnly: true },
  );
}
