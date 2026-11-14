import { makeReadPage } from "@/components/ReadPost";

const { ReadPage, generateMetadata } = makeReadPage({ collections: null, fixedLocale: "en" });

export { generateMetadata };
export default ReadPage;
