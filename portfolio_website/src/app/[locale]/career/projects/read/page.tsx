import { makeReadPage } from "@/components/ReadPost";

const { ReadPage, generateMetadata } = makeReadPage({ collections: ["projects"] });

export { generateMetadata };
export default ReadPage;
