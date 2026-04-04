import { Container } from "@radix-ui/themes"
import { getTranslations } from "next-intl/server"
import { Link } from "@/app/i18n/navigation"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import BlogSectionTabs from "@/app/blogs/BlogSectionTabs"
import { SectionHeading, SurfaceCard } from "@/app/components/system"

interface Props {
  params: { locale: string }
}

export default async function ArticlesPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: "blogs" })
  const articles = await getMdxArticleList(params.locale)

  return (
    <Container>
      <section className="space-y-6 px-5 py-10 sm:py-12 lg:py-16">
        <BlogSectionTabs active="mdx" />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {t("mdxEyebrow")}
          </p>
          <SectionHeading
            align="left"
            title={t("mdxListTitle")}
            description={t("mdxListDescription")}
            className="mb-0"
            titleClassName="text-3xl sm:text-4xl"
          />
        </div>

        <div className="grid gap-5">
          {articles.map((article) => (
            <SurfaceCard
              key={article.slug}
              className="transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/30"
              interactive
            >
              <Link href={`/articles/${article.slug}`} className="block">
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
            </SurfaceCard>
          ))}
        </div>
      </section>
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
