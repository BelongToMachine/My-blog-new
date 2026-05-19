import AboutSections from "../components/about/AboutSections"
import HomeLandingAboutExperience from "../components/home/HomeLandingAboutExperience"

interface Props {
  params: { locale: string }
}

export default function IndexPage({ params }: Props) {
  return (
    <HomeLandingAboutExperience>
      <AboutSections
        locale={params.locale}
        sectionId="home-about-section"
        showBackLink={false}
        showBezierCurve
        heroVariant="spotlight"
      />
    </HomeLandingAboutExperience>
  )
}
