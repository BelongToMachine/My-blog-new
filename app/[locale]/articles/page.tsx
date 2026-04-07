import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { Link } from "@/app/i18n/navigation"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import BlogSectionTabs from "@/app/blogs/BlogSectionTabs"

interface Props {
  params: { locale: string }
}

export default async function ArticlesPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: "blogs" })
  const articles = await getMdxArticleList(params.locale)

  return (
    <Container className="content-page-shell">
      <div className="space-y-6 p-5">
        <BlogSectionTabs active="mdx" />
        <div className="space-y-2">
          <p className="section-kicker">
            {t("mdxEyebrow")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("mdxListTitle")}
          </h1>
          <p className="section-copy max-w-2xl">
            {t("mdxListDescription")}
          </p>
        </div>

        <div className="grid gap-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="article-preview-card"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary/80">
                  <span>{t("mdxBadge")}</span>
                  <span className="h-1 w-1 rounded-full bg-primary/60" />
                  <span>{article.publishedOn}</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {article.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-foreground/70">
                  {article.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" })

  return {
    title: t("mdxArticlesTitle"),
    description: t("mdxArticlesDescription"),
    alternates: {
      canonical: `/${params.locale}/articles`,
      languages: {
        en: "/en/articles",
        zh: "/zh/articles",
      },
    },
  }
}
