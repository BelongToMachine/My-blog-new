import { getMdxArticle, getMdxArticleList } from "@/app/service/mdxArticles"
import { Box, Container, Grid } from "@radix-ui/themes"
import { notFound } from "next/navigation"
import styles from "@/app/blogs/[id]/post.module.css"
import TableOfContent from "@/app/blogs/_components/TableOfContent"
import BlogSectionTabs from "@/app/blogs/BlogSectionTabs"
import ArticleEnhancement from "@/app/articles/_components/ArticleEnhancement"
import ArticleBody from "@/app/articles/_components/ArticleBody"

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
            <article
              className={`${styles.article} rounded-[0.55rem] border border-border/70 bg-background/85 shadow-sm`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                MDX POC
              </p>
              <h1>{article.title}</h1>
              <p className="post-meta">{article.publishedOn}</p>
              <ArticleBody slug={article.slug} htmlContent={article.htmlContent} headings={article.headings} />
            </article>
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
