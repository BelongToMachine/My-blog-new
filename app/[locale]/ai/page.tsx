import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import AIPlayground from "./AIPlayground"

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" })

  return {
    title: t("aiTitle"),
    description: t("aiDescription"),
  }
}

export default function AIPage() {
  return <AIPlayground />
}
