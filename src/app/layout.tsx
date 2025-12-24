import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";

import { auth } from "../auth";
import "./globals.css";
import Provider from "@/components/Provider";

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

export type PageProps = {
  params: Promise<{ pid: string }>;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on server with error handling
  let session = null;
  try {
    session = await auth();
  } catch (error: any) {
    // Handle JWT session errors gracefully
    // This can happen when:
    // - Session token is expired or invalid
    // - JWT secret is missing or changed
    // - Session cookie is corrupted
    if (error?.name === 'JWTSessionError' || error?.message?.includes('JWT')) {
      // Silently handle JWT errors - user will be redirected to login if needed
      // Don't log to avoid noise in production
      if (process.env.NODE_ENV === 'development') {
        console.warn('JWT session error (user may need to re-authenticate):', error.message);
      }
    } else {
      // Log other errors for debugging
      console.warn('Error fetching session in RootLayout:', error);
    }
    // Session will be null, which is fine - middleware/auth will handle redirects
  }

  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased h-full`}
      >
        <Provider session={session}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
