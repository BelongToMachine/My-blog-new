import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { Link } from "@/app/i18n/navigation"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import BlogSectionTabs from "@/app/blogs/BlogSectionTabs"
import RetroPanel from "@/app/components/system/RetroPanel"
import { RetroBadge } from "@/app/components/system/RetroBadge"

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
        <RetroPanel
          eyebrow={t("mdxEyebrow")}
          title={t("mdxListTitle")}
          action={<RetroBadge tone="primary">{articles.length} logs</RetroBadge>}
        >
          <p className="section-copy max-w-2xl">{t("mdxListDescription")}</p>
        </RetroPanel>

        <div className="grid gap-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="article-preview-card pixel-panel"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <RetroBadge tone="primary">{t("mdxBadge")}</RetroBadge>
                  <RetroBadge tone="neutral">{article.locale}</RetroBadge>
                  <RetroBadge tone="amber">{article.publishedOn}</RetroBadge>
                </div>
                <h2 className="font-pixel text-xl uppercase tracking-[0.08em] text-foreground sm:text-2xl">
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
