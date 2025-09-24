'use client'

import FeedbackProvider from "@/context/feedback";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

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
                {children}
            </FeedbackProvider>
        </SessionProvider>
    )
}

export default Provider