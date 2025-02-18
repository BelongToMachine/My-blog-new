"use server"

import prisma from "@/prisma/client"

interface Props {
  blogId: number
  action: "like" | "dislike"
}

export async function toggleLikeFromServer({ blogId, action }: Props) {
  const blog = await prisma.issue.findUnique({
    where: { id: blogId },
  })

  if (!blog) {
    throw new Error("Blog not found")
  }

  if (action === "like") {
    await prisma.issue.update({
      where: { id: blogId },
      data: {
        likes: {
          increment: 1,
        },
      },
    })
  } else if (action === "dislike" && blog.likes > 0) {
    await prisma.issue.update({
      where: { id: blogId },
      data: {
        likes: {
          decrement: 1,
        },
      },
    })
  } else {
    throw new Error("Invalid action")
  }

  const updatedBlog = await prisma.issue.findUnique({
    where: { id: blogId },
  })

  return updatedBlog
}

export async function fetchBlogLikesFromServer(issueId: number) {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  })
  if (!issue) throw new Error("Issue not found")
  return issue.likes
}
