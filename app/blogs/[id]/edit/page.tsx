import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function LegacyEditBlogPage({ params }: Props) {
  const { id } = await params
  redirect(`/zh/blogs/${id}/edit`)
}
