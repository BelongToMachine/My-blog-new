import { redirect } from "next/navigation"

export default function LegacyArticleDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  redirect(`/zh/articles/${params.slug}`)
}
