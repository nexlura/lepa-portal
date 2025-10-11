import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

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

export function useAuthSwitcher() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const switchAuthMethod = (oldMethod: string, newMethod: string, cleaner: Dispatch<SetStateAction<string>>) => {
        const params = new URLSearchParams(searchParams);

        // Remove the old param completely
        params.delete(oldMethod);

        // Add the new param
        params.set(newMethod, '');

        //clear oldMethod value
        cleaner('')

        // Update the URL without adding to history
        router.replace(`${pathname}?${params.toString()}`);
    };

    return { switchAuthMethod };
}