import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="transition-colors duration-500 ease-in-out bg-zinc-100 dark:bg-zinc-900">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <header>
              <Navbar />
            </header>
            <main className="min-h-screen flex flex-col items-center justify-center relative">
              {children}
            </main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
