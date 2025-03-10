import prisma from "@/prisma/client"
import BlogSummary from "./BlogSummary"
import LatestBlogs from "./LatestBlogs"
import BlogChart from "./BlogChart"
import { Container, Flex, Grid } from "@radix-ui/themes"
import { Metadata } from "next"
import AboutMe from "./components/AboutMe"
import Hero from "./components/Hero"
import Projects from "./projects"
import { Tag } from "@prisma/client"
import SummaryHeader from "./SummaryHeader"
import Contact from "./Contact"
import DynamicBezierCurve from "./components/navbar/DynamicBezierCurve"
import PostSummary from "./PostSummary"

interface Props {
  searchParams: { tags: Tag }
}

export default async function Home({ searchParams }: Props) {
  const open = await prisma.issue.count({
    where: { status: "FINISHED" },
  })
  const inProgress = await prisma.issue.count({
    where: { status: "IN_PROGRESS" },
  })
  const closed = await prisma.issue.count({
    where: { status: "CLOSED" },
  })

  return (
    <>
      <DynamicBezierCurve>
        <Hero />
      </DynamicBezierCurve>
      <Container>
        <AboutMe />
        <Projects />
        <SummaryHeader />
        <PostSummary web={open} tech={inProgress} nonTech={closed} />
        <Contact />
      </Container>
    </>
  )
}

export const metadata: Metadata = {
  title: "Jie's Home Page",
  description: "View Jie's blog",
}
