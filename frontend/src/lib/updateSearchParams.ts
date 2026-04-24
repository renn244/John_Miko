import type { SetURLSearchParams } from "react-router";

export const updateSearchParam = (
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams,
  key: string,
  value: string | undefined
) => {
  const newSearchParams = new URLSearchParams(searchParams.toString());
  if (value && value !== '') {
    newSearchParams.set(key, value);
  } else {
    newSearchParams.delete(key);
  }
  setSearchParams(newSearchParams, { replace: true });
};