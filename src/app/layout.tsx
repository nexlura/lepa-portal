import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { auth } from "../auth";
import "./globals.css";
import Provider from "@/components/Provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Temporarily disabled Merriweather due to Turbopack font loading issue
// const merriweather = Merriweather({
//   variable: "--font-merriweather",
//   subsets: ["latin"],
//   weight: ["300", "400", "700", "900"],
//   display: "swap",
// });

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
  // Use a helper function to safely get session without throwing errors
  const getSessionSafely = async () => {
    try {
      return await auth();
    } catch {
      return null;
    }
  };

  const session = await getSessionSafely();

  return (
    <html lang="en" className="h-full bg-white">
      <body
        className={`${inter.variable} antialiased h-full`}
      >
        <Provider session={session}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
