import type { Dispatch, SetStateAction } from "react";

export const updateSearchParam = (
  searchParams: URLSearchParams,
  setSearchParams: Dispatch<SetStateAction<URLSearchParams>>,
  key: string,
  value: string | undefined
) => {
  const newSearchParams = new URLSearchParams(searchParams.toString());
  if (value && value !== '') {
    newSearchParams.set(key, value);
  } else {
    newSearchParams.delete(key);
  }
  setSearchParams(newSearchParams);
};