import { getMdxArticle, getMdxArticleList } from "@/app/service/mdxArticles"
import { Box, Container, Grid } from "@radix-ui/themes"
import { notFound } from "next/navigation"
import styles from "@/app/articles/post.module.css"
import TableOfContent from "@/app/articles/_components/TableOfContent"
import ArticleEnhancement from "@/app/articles/_components/ArticleEnhancement"
import ArticleBody from "@/app/articles/_components/ArticleBody"
import ArticleFooter from "@/app/articles/_components/ArticleFooter"
import { RetroBadge } from "@/app/components/system/RetroBadge"

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
        <ArticleEnhancement slug={article.slug} />
        <Grid columns={{ initial: "1", lg: "5" }} gap="5">
          <Box className="min-w-0 lg:col-span-4">
            <div className={styles.article}>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="terminal-label">article detail</div>
                  <div className="font-pixel text-sm uppercase tracking-[0.16em] text-foreground md:text-base">
                    {article.title}
                  </div>
                </div>
                <RetroBadge tone="amber">{article.publishedOn}</RetroBadge>
              </div>
              <div className="mb-5 flex flex-wrap gap-3">
                <RetroBadge tone="primary">MDX POC</RetroBadge>
                <RetroBadge tone="neutral">{article.locale}</RetroBadge>
              </div>
              <ArticleBody slug={article.slug} htmlContent={article.htmlContent} headings={article.headings} />
            </div>
            <ArticleFooter />
          </Box>
          <Box className="hidden lg:block lg:col-span-1">
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
