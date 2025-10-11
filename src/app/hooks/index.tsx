import { useSearchParams } from "next/navigation";

export function useQueryKeys() {
    const searchParams = useSearchParams();

    // Return all param keys — even those without values
    const getKeys = () => {
        const keys = [];
        for (const [key] of searchParams.entries()) {
            keys.push(key);
        }

        // `entries()` only returns keys that appear before '=' (even if empty)
        // So if `email=` exists, `key` will still be captured
        return keys;
    };

    return getKeys();
}