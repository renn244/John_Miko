import type { SetURLSearchParams } from "react-router";

export const updateSearchParams = (
  setSearchParams: SetURLSearchParams,
  updates: Record<string, string | undefined>
) => {
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== '') {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    }
    return next;
  }, { replace: true });
};