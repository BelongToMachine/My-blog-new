import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function LegacyBlogDetailPage({ params }: Props) {
  const { id } = await params
  redirect(`/zh/blogs/${id}`)
}
