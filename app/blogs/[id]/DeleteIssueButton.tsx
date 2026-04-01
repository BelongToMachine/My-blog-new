"use client";

import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useRouter } from "@/app/i18n/navigation";

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
          <Button disabled={isDeleting} color="red" className="rounded-[0.45rem]">
            {t("delete")}
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content className="rounded-[0.55rem]">
          <AlertDialog.Title>{t("deleteConfirm")}</AlertDialog.Title>
          <AlertDialog.Description></AlertDialog.Description>
          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="soft" className="rounded-[0.45rem]">
                {t("deleteCancel")}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deleteIssue} className="rounded-[0.45rem]">
                {t("deleteAction")}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content className="rounded-[0.55rem]">
          <AlertDialog.Title>{t("deleteErrorTitle")}</AlertDialog.Title>
          <AlertDialog.Description>
            {t("deleteErrorDescription")}
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            my="2"
            className="rounded-[0.45rem]"
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
