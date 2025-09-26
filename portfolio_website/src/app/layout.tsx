// src/app/layout.tsx
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { NavProvider, useNav } from "@/context/NavContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
