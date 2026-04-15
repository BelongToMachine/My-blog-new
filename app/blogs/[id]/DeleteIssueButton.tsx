"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useRouter } from "@/app/i18n/navigation";
import { Button } from "@/app/components/ui/button";

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const t = useTranslations("blogs");
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteIssue = async () => {
    try {
      setIsDeleting(true);
      await axios.delete("/api/blogs/" + issueId);
      router.push("/blogs");
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      setError(true);
    }
  };
  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button disabled={isDeleting} variant="destructive">
            {t("delete")}
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content className="pixel-panel border border-border/80 bg-card/95 shadow-[var(--shadow-overlay)]">
          <AlertDialog.Title className="font-pixel text-sm uppercase tracking-[0.14em]">{t("deleteConfirm")}</AlertDialog.Title>
          <AlertDialog.Description></AlertDialog.Description>
          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="outline">
                {t("deleteCancel")}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="destructive" onClick={deleteIssue}>
                {t("deleteAction")}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content className="pixel-panel border border-border/80 bg-card/95 shadow-[var(--shadow-overlay)]">
          <AlertDialog.Title className="font-pixel text-sm uppercase tracking-[0.14em]">{t("deleteErrorTitle")}</AlertDialog.Title>
          <AlertDialog.Description>
            {t("deleteErrorDescription")}
          </AlertDialog.Description>
          <Button
            variant="outline"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteIssueButton;
