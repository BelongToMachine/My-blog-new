import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import ContactForm from "./ContactForm"

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" })

  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
  }
}

export default function ContactPage() {
  return <ContactForm />
}
