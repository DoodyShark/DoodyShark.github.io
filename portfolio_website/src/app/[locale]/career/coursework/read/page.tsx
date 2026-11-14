import { makeReadPage } from "@/components/ReadPost";

const { ReadPage, generateMetadata } = makeReadPage({ collections: ["coursework_masters", "coursework_bachelors"], fixedLocale: "en" });

export { generateMetadata };
export default ReadPage;
