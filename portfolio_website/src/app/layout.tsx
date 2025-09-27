// src/app/layout.tsx
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { NavProvider } from "@/context/NavContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>

      <body className="transition-colors duration-500 ease-in-out bg-gray-100 dark:bg-gray-700">
        <Providers>
          <NavProvider>
            <header>
              <Navbar />
            </header>
            <main className="min-h-screen flex flex-col items-center justify-center relative">
              {children}
            </main>
          </NavProvider>
        </Providers>
      </body>
    </html>
  );
}
