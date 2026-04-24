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
            <div className="mb-10 md:mb-14">
              <div className="terminal-label mb-3">article detail</div>
              <h1 className="font-pixel uppercase tracking-[0.05em] text-foreground leading-[1.08] text-[clamp(2rem,4vw,3.4rem)] mb-5">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <RetroBadge tone="amber">{article.publishedOn}</RetroBadge>
                <RetroBadge tone="primary">MDX POC</RetroBadge>
                <RetroBadge tone="neutral">{article.locale}</RetroBadge>
              </div>
            </div>
            <div className={styles.article}>
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
