import AboutSections from "../components/about/AboutSections"

interface Props {
  params: { locale: string }
}

export default function IndexPage({ params }: Props) {
  return (
    <AboutSections
      locale={params.locale}
      sectionId="home-about-section"
      showBackLink={false}
      pinHeroUnderDesktop
      mirrorDesktopCurve
      heroVariant="spotlight"
    />
  )
}
