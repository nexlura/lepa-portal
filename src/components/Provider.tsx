'use client'

import FeedbackProvider from "@/context/feedback";
import { Session } from "next-auth";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const TokenRefresher = () => {
    const { data: session, update } = useSession();
    const isRefreshingRef = useRef(false);
    const updateRef = useRef(update);

    // Keep the latest update function
    useEffect(() => {
        updateRef.current = update;
    }, [update]);

    useEffect(() => {
        const checkAndRefresh = async () => {
            // Only run if user exists
            if (!session?.user) return; // ✅ prevents loop

            if (isRefreshingRef.current) return;
            isRefreshingRef.current = true;

            try {
                const check = await fetch("/api/auth/session");
                if (check.status === 401) {
                    // Only sign out if we are on a protected route
                    // You can skip signOut on auth pages
                    if (!window.location.pathname.startsWith("/auth")) {
                        await signOut({ callbackUrl: "/" });
                    }
                    return;
                }

                const res = await fetch("/api/auth/refresh", { method: "POST" });
                if (res.ok) {
                    const data = await res.json();
                    if ((data?.accessToken || data?.refreshToken) && updateRef.current) {
                        await updateRef.current({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                        });
                    }
                }
            } catch (err) {
                console.error("Error refreshing token:", err);
                if (session?.user) {
                    await signOut({ callbackUrl: "/" });
                }
            } finally {
                isRefreshingRef.current = false;
            }
        };

        const timeoutId = setTimeout(checkAndRefresh, 5000);
        const intervalId = setInterval(checkAndRefresh, 50 * 60 * 1000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [session?.user]);


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