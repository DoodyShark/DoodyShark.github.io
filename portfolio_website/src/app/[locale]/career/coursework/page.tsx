import { getTranslations, setRequestLocale } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import TranscriptLink from "@/components/TranscriptLink";

export default async function CourseworkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "career.coursework" });
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <TranscriptLink pageKey="transcript-merged-url" label={t("fullTranscript")} />
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">{t("masters")}</h2>
        <TranscriptLink pageKey="transcript-masters-url" label={t("transcript")} />
      </div>
      <MarkdownCards collection="coursework_masters" href_path="/career/coursework/read" row_width={3} />
      <div className="flex flex-wrap items-center gap-3 mt-6 mb-6">
        <h2 className="text-xl font-bold">{t("bachelors")}</h2>
        <TranscriptLink pageKey="transcript-bachelors-url" label={t("transcript")} />
      </div>
      <MarkdownCards collection="coursework_bachelors" href_path="/career/coursework/read" row_width={3} />
    </div>
  );
}
