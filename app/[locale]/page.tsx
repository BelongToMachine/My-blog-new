import type { Metadata } from "next"
import AboutSections from "../components/about/AboutSections"

interface Props {
  params: { locale: string }
}

export function generateMetadata(): Metadata {
  return {
    title: {
      absolute: "Jie's Craft",
    },
  }
}

export default function IndexPage({ params }: Props) {
  return (
    <AboutSections
      locale={params.locale}
      sectionId="home-about-section"
      showBackLink={false}
      pinHeroUnderDesktop
    />
  )
}
