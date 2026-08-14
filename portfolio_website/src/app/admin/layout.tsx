import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "Admin – Portfolio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen" style={{ background: '#09090b', color: '#e4e4e7' }}>
        {children}
      </body>
    </html>
  );
}
