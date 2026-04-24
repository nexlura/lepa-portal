'use client'

import FeedbackProvider from "@/context/feedback";
import { Session } from "next-auth";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const TokenRefresher = () => {
    const { data: session, update } = useSession();
    const isRefreshingRef = useRef(false);
    const updateRef = useRef(update);

    useEffect(() => { updateRef.current = update; }, [update]);

    useEffect(() => {
        if (!session?.user) return; // only run for authenticated users

        const checkAndRefresh = async () => {
            if (isRefreshingRef.current) return;
            isRefreshingRef.current = true;

            try {
                const check = await fetch("/api/auth/session");
                
                // Check if response is ok and has content
                if (!check.ok) {
                    if (!window.location.pathname.startsWith("/auth")) {
                        await signOut({ callbackUrl: "/" });
                    }
                    return;
                }
                
                // Check content type and content length before parsing
                const contentType = check.headers.get('content-type');
                const contentLength = check.headers.get('content-length');
                
                // If no content or not JSON, treat as no session
                if (contentLength === '0' || !contentType?.includes('application/json')) {
                    if (!window.location.pathname.startsWith("/auth")) {
                        await signOut({ callbackUrl: "/" });
                    }
                    return;
                }
                
                // Read response as text first to check if it's empty
                const text = await check.text();
                if (!text || text.trim() === '') {
                    if (!window.location.pathname.startsWith("/auth")) {
                        await signOut({ callbackUrl: "/" });
                    }
                    return;
                }
                
                // Parse JSON safely
                let sessionData;
                try {
                    sessionData = JSON.parse(text);
                } catch (parseError) {
                    // If JSON parsing fails, treat as no session
                    if (!window.location.pathname.startsWith("/auth")) {
                        await signOut({ callbackUrl: "/" });
                    }
                    return;
                }
                
                // Check if session is null or invalid (no user)
                if (!sessionData || !sessionData.user || check.status === 401) {
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
                // Silently handle errors - don't log to avoid console noise
                if (session?.user) {
                    try {
                        await signOut({ callbackUrl: "/" });
                    } catch {
                        // Silently handle signOut errors
                    }
                }
            } finally {
                isRefreshingRef.current = false;
            }
        };

        const timeoutId = setTimeout(checkAndRefresh, 5000);
        const intervalId = setInterval(checkAndRefresh, 10 * 60 * 1000); // 10 min

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
                {session?.user && <TokenRefresher />}
                {children}
            </FeedbackProvider>
        </SessionProvider>
    )
}

export default Provider