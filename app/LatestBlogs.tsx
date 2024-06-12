import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import { create } from "domain";
import React from "react";
import { IssueStatusBadge, Link } from "./components";

const LatestBlogs = async () => {
  const blogs = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card>
      <Heading size="4" mb="4">
        最近的博客
      </Heading>
      <Table.Root>
        <Table.Body>
          {blogs.map((blog) => (
            <Table.Row key={blog.id}>
              <Table.Cell>
                <Flex direction="column" align="start" gap="2">
                  <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                  <IssueStatusBadge status={blog.status} />
                </Flex>
                {blog.assignedToUser && (
                  <Avatar
                    src={blog.assignedToUser?.image!}
                    fallback="?"
                    size="2"
                    radius="full"
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestBlogs;
