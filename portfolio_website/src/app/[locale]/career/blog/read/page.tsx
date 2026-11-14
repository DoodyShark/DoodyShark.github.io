import { makeReadPage } from "@/components/ReadPost";

const { ReadPage, generateMetadata } = makeReadPage({ collections: ["blog", "drafts"] });

export { generateMetadata };
export default ReadPage;
