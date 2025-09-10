import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "../../auth";
import "./globals.css";
import FeedbackProvider from "@/context/feedback";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lepa",
  description: "The mordern solution for schools to manage admissions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // fetch session on server

  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased h-full`}
      >
        <SessionProvider session={session}>
          <FeedbackProvider>
            {children}
          </FeedbackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
