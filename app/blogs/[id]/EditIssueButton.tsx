"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/app/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/app/i18n/navigation";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  const t = useTranslations("blogs");

  return (
    <Button variant="outline" asChild>
      <Link href={`/blogs/${issueId}/edit`} className="flex items-center gap-2">
        <Pencil2Icon />
        {t("edit")}
      </Link>
    </Button>
  );
};

export default EditIssueButton;
