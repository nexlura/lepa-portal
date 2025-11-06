'use client'

import FeedbackProvider from "@/context/feedback";
import { Session } from "next-auth";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const TokenRefresher = () => {
    const { update } = useSession();
    const isRefreshingRef = useRef(false);
    const updateRef = useRef(update);

    // Keep the ref updated with the latest update function
    useEffect(() => {
        updateRef.current = update;
    }, [update]);

    useEffect(() => {
        const checkAndRefresh = async () => {
            // Prevent multiple simultaneous refresh calls
            if (isRefreshingRef.current) {
                return;
            }

            isRefreshingRef.current = true;

            try {
                // Check if session is still valid
                const check = await fetch('/api/auth/session', { method: 'GET' });
                if (check.status === 401) {
                    await signOut({ callbackUrl: '/' });
                    return;
                }

                // Attempt refresh
                const res = await fetch('/api/auth/session', { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    if ((data?.accessToken || data?.refreshToken) && updateRef.current) {
                        await updateRef.current({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                        });
                    }
                }
            } catch {
                // On any error, attempt to sign out to keep state consistent
                await signOut({ callbackUrl: '/' });
            } finally {
                isRefreshingRef.current = false;
            }
        };

        // Run once after a short delay on mount, then periodically
        const timeoutId = setTimeout(() => {
            checkAndRefresh();
        }, 5000); // Wait 5 seconds after mount before first refresh

        const intervalId = setInterval(checkAndRefresh, 10 * 60 * 1000); // every 10 minutes

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []); // Empty dependency array - only run once on mount

    return null;
};

const Provider = ({
    children,
    session
}: Readonly<{
    children: React.ReactNode,
    session: Session | null;
}>) => {
    return (
        <SessionProvider session={session} key={session?.user.email}>
            <FeedbackProvider>
                <TokenRefresher />
                {children}
            </FeedbackProvider>
        </SessionProvider>
    )
}

export default Provider