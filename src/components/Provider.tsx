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
                if (check.status === 401) {
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
                if (session?.user) await signOut({ callbackUrl: "/" });
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