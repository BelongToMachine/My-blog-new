import { Button, Flex, Link } from "@radix-ui/themes";
import React from "react";
import BlogStatusFilter from "./BlogStatusFilter";

const IssueActions = () => {
  return (
    <Flex className="space-x-3">
      <Button>
        <Link href="/blogs/new">New Blog</Link>
      </Button>
      <BlogStatusFilter />
    </Flex>
  );
};

export default IssueActions;
