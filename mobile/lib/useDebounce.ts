import { useEffect, useState } from "react";

const useDebouncedValue = <T>(value: T, delayMs: number) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [delayMs, value]);

    return debounced;
}

export default useDebouncedValue;