"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowDownIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Flex, Text } from "@radix-ui/themes";
import { Button } from "@/app/components/ui/button";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/app/i18n/navigation";

interface Props {
  itemCounts: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCounts, pageSize, currentPage }: Props) => {
  const t = useTranslations("blogs");
  const pageCount = Math.ceil(itemCounts / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();

  if (pageCount <= 1) return null;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push("?" + params.toString());
  };

  return (
    <Flex align="center" gap="2">
      <Text className="mr-2">
        {t("page", { current: currentPage, total: pageCount })}
      </Text>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
      >
        <ChevronRightIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === pageCount}
        onClick={() => changePage(pageCount)}
      >
        <DoubleArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
