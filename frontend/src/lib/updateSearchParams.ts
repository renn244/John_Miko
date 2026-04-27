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

// import type { SetURLSearchParams } from "react-router";

// export const updateSearchParam = (
//   setSearchParams: SetURLSearchParams,
//   key: string,
//   value: string | undefined
// ) => {
//   setSearchParams((prev) => {
//     const next = new URLSearchParams(prev)
//     if (value && value !== '') {
//       next.set(key, value)
//     } else {
//       next.delete(key)
//     }
//     return next
//   }, { replace: true })
// }