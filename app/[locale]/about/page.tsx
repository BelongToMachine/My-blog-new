import { getTranslations } from "next-intl/server"
import AboutSections from "../../components/about/AboutSections"

interface Props {
  params: { locale: string }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" })

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: {
      canonical: `/${params.locale}/about`,
      languages: {
        en: "/en/about",
        zh: "/zh/about",
      },
    },
  }
}

export default async function AboutPage({ params }: Props) {
  return <AboutSections locale={params.locale} showBezierCurve heroVariant="spotlight" />
}
