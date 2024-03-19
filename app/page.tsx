import prisma from "@/prisma/client";
import BlogSummary from "./BlogSummary";
import LatestBlogs from "./LatestBlogs";
import BlogChart from "./BlogChart";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import AboutMe from "./components/AboutMe";
import ProjectTags from "./components/ProjectTags";
import Hero from "./components/Hero";
import ProjectsDetail from "./components/ProjectsDetail";
import Projects from "./projects";
import { Tag } from "@prisma/client";

interface Props {
  searchParams: { tags: Tag };
}

export default async function Home({ searchParams }: Props) {
  const open = await prisma.issue.count({
    where: { status: "FINISHED" },
  });
  const inProgress = await prisma.issue.count({
    where: { status: "IN_PROGRESS" },
  });
  const closed = await prisma.issue.count({
    where: { status: "CLOSED" },
  });

  return (
    <main>
      <Hero />
      <AboutMe />
      <div className="container mt-6 mx-auto px-12 py-2">
        <Projects />
        <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600 lg:text-6xl">
          My Blogs Summary
        </h1>
        <Grid columns={{ initial: "1", md: "2" }} gap="5" mt="8">
          <Flex direction="column" gap="5">
            <BlogSummary open={open} inProgress={inProgress} closed={closed} />
            <BlogChart open={open} inProgress={inProgress} closed={closed} />
          </Flex>
          <LatestBlogs />
        </Grid>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Jie's Home Page",
  description: "View Jie's blog",
};
