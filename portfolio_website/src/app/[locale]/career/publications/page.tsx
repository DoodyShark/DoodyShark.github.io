import { setRequestLocale } from "next-intl/server";
import { getPublications } from "@/lib/data";
import PublicationList from "./PublicationList";

export default async function PublicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PublicationList pubs={await getPublications()} />;
}
