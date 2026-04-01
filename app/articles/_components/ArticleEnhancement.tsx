import JQueryArticleExperience from "./JQueryArticleExperience"

export default function ArticleEnhancement({ slug }: { slug: string }) {
  if (slug === "jquery-basic-syntax-practice") {
    return <JQueryArticleExperience />
  }

  return null
}
