import { getMdxArticle, getMdxArticleList } from "@/app/service/mdxArticles"
import { notFound } from "next/navigation"
import ArticleDetailLayout from "@/app/articles/_components/ArticleDetailLayout"

interface Props {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  const articles = await getMdxArticleList()

  return articles.map((article) => ({
    locale: article.locale,
    slug: article.slug,
  }))
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await getMdxArticle(params.slug, params.locale).catch(() => null)

  if (!article || article.locale !== params.locale) {
    notFound()
  }

  return (
    <ArticleDetailLayout
      article={{
        slug: article.slug,
        title: article.title,
        publishedOn: article.publishedOn,
        locale: article.locale,
        htmlContent: article.htmlContent,
        headings: article.headings,
      }}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const article = await getMdxArticle(params.slug, params.locale).catch(() => null)

  if (!article || article.locale !== params.locale) {
    return {}
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/${params.locale}/articles/${params.slug}`,
      languages: {
        en: `/en/articles/${params.slug}`,
        zh: `/zh/articles/${params.slug}`,
      },
    },
  }
}
