import { makeReadPage } from "@/components/ReadPost";

const { ReadPage, generateMetadata } = makeReadPage({ collections: ["blog_personal"], fixedLocale: "en" });

export { generateMetadata };
export default ReadPage;
