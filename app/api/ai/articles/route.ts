import { NextRequest, NextResponse } from "next/server"
import { getMdxArticleList } from "@/app/service/mdxArticles"

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale")?.trim() || undefined

  try {
    const articles = await getMdxArticleList(locale)
    return NextResponse.json(
      articles.map((article) => ({
        slug: article.slug,
        title: article.title,
      })),
    )
  } catch (error) {
    console.warn("[api/ai/articles] GET failed:", error)
    return NextResponse.json({ error: "Failed to load articles" }, { status: 500 })
  }
}
