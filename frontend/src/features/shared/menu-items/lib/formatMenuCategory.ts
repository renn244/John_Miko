export const formatMenuCategory = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        `${word.charAt(0).toLocaleUpperCase()}${word.slice(1).toLocaleLowerCase()}`,
    )
    .join(" ");
