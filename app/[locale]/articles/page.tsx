import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { Link } from "@/app/i18n/navigation"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import { RetroBadge } from "@/app/components/system/RetroBadge"

interface Props {
  params: { locale: string }
}

export default async function ArticlesPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: "blogs" })
  const articles = await getMdxArticleList(params.locale)

  return (
    <Container className="content-page-shell">
        <div className="space-y-8 p-5">
        {/* Page Header */}
        <div className="space-y-6 mdx-index-shell">
          <div className="flex flex-wrap items-center gap-3">
            <div className="pixel-header-label">
              {t("mdxEyebrow")}
            </div>
            <RetroBadge tone="primary">
              {articles.length} {params.locale === "zh" ? "篇" : "posts"}
            </RetroBadge>
          </div>
          <div className="pixel-title-wrapper">
            <h1 className="pixel-title text-foreground">
              {params.locale === "zh" ? "文章" : "ARTICLES"}
            </h1>
          </div>
          <p className="section-copy mdx-index-copy max-w-2xl">
            {t("mdxListDescription")}
          </p>
        </div>

        {/* Articles */}
        <div className="grid gap-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="pixel-card group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <RetroBadge tone="primary">{t("mdxBadge")}</RetroBadge>
                  <RetroBadge tone="neutral">{article.locale}</RetroBadge>
                  <RetroBadge tone="amber">{article.publishedOn}</RetroBadge>
                </div>
                <h2 className="mdx-index-card-title font-pixel text-xl uppercase tracking-[0.08em] text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {article.title}
                </h2>
                <p className="mdx-index-card-copy max-w-3xl text-sm leading-7 text-foreground/70">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-primary">
                  <span className="font-pixel uppercase tracking-[0.2em]">
                    {params.locale === "zh" ? "阅读" : "Read"}
                  </span>
                  <span className="pixel-arrow transition-transform duration-200 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
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
