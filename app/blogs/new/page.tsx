import { ErrorMessage } from "@/app/components";
import dynamic from "next/dynamic";

const IssueForm = dynamic(() => import("@/app/blogs/_components/IssueForm"), {
  ssr: false,
});

const NewIssuePage = () => {
  return MODE === "dev" ? (
    <IssueForm />
  ) : (
    <ErrorMessage>This functionality is currently not allowed</ErrorMessage>
  );
};

const MODE = process.env.NEXT_PUBLIC_DEV_MODE;

export default NewIssuePage;
