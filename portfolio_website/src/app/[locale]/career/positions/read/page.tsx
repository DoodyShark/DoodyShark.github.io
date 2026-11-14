import { makeReadPage } from "@/components/ReadPost";

const { ReadPage, generateMetadata } = makeReadPage({ collections: ["positions"] });

export { generateMetadata };
export default ReadPage;
