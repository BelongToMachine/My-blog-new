"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/app/i18n/navigation";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  const t = useTranslations("blogs");

  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/blogs/${issueId}/edit`}>{t("edit")}</Link>
    </Button>
  );
};

export default EditIssueButton;
