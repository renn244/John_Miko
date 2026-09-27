-- Email addresses are canonicalized before the application starts relying on
-- case-sensitive PostgreSQL uniqueness for case-insensitive identity.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "User"
    GROUP BY lower(btrim("email"))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot normalize User.email: case-insensitive duplicate emails require manual resolution';
  END IF;
END $$;

UPDATE "User"
SET "email" = lower(btrim("email"))
WHERE "email" IS DISTINCT FROM lower(btrim("email"));
