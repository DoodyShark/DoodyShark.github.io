import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import GardenBackground from "@/components/GardenBackground";
import FloatingGardenButton from "@/components/FloatingGardenButton";
import HoverAdminTrigger from "@/components/HoverAdminTrigger";
import GravityToggle from "@/components/GravityToggle";
import WindChimes from "@/components/WindChimes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Dhiyaa Al Jorf",
  description: "Personal portfolio",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="transition-colors duration-500 ease-in-out" style={{ background: 'var(--m-bg)', color: 'var(--m-text)' }}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <header className="relative" style={{ zIndex: 200 }}>
              <Navbar />
            </header>
            <main className="min-h-screen flex flex-col items-center justify-center relative">
              <GardenBackground />
              {children}
            </main>
            <FloatingGardenButton />
            <HoverAdminTrigger />
            <GravityToggle />
            <WindChimes />
            <Analytics />
            <SpeedInsights />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
