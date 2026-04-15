import { getMdxArticle, getMdxArticleList } from "@/app/service/mdxArticles"
import { Box, Container, Grid } from "@radix-ui/themes"
import { notFound } from "next/navigation"
import styles from "@/app/blogs/[id]/post.module.css"
import TableOfContent from "@/app/blogs/_components/TableOfContent"
import BlogSectionTabs from "@/app/blogs/BlogSectionTabs"
import ArticleEnhancement from "@/app/articles/_components/ArticleEnhancement"
import ArticleBody from "@/app/articles/_components/ArticleBody"
import { RetroBadge } from "@/app/components/system/RetroBadge"
import RetroPanel from "@/app/components/system/RetroPanel"

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
    <Container>
      <div className="space-y-6 p-5">
        <BlogSectionTabs active="mdx" />
        <ArticleEnhancement slug={article.slug} />
        <Grid columns={{ initial: "1", lg: "5" }} gap="5">
          <Box className="lg:col-span-4">
            <RetroPanel
              className={styles.article}
              eyebrow="article detail"
              title={article.title}
              action={<RetroBadge tone="amber">{article.publishedOn}</RetroBadge>}
              contentClassName="px-5 py-5 sm:px-6 sm:py-6"
            >
              <div className="mb-5 flex flex-wrap gap-3">
                <RetroBadge tone="primary">MDX POC</RetroBadge>
                <RetroBadge tone="neutral">{article.locale}</RetroBadge>
              </div>
              <ArticleBody slug={article.slug} htmlContent={article.htmlContent} headings={article.headings} />
            </RetroPanel>
          </Box>
          <Box className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <TableOfContent headings={article.headings} />
            </div>
          </Box>
        </Grid>
      </div>
    </Container>
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
