import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import BlogParser, { Heading } from "@/app/service/BlogParser"

const FALLBACK_ARTICLES_DIR = path.join(process.cwd(), "app/content/mdx")
const LOCALES = ["zh", "en"] as const
type ArticleLocale = (typeof LOCALES)[number]
type ContentSourceMode = "private-repo" | "tracked-fallback"

export interface MdxArticleListItem {
  slug: string
  title: string
  description: string
  publishedOn: string
  locale: ArticleLocale
  source: "private-mdx"
}

export interface MdxArticle extends MdxArticleListItem {
  htmlContent: string
  headings: Heading[]
}

interface Frontmatter {
  title?: string
  description?: string
  publishedOn?: string
  locale?: ArticleLocale
  slug?: string
  isPublished?: boolean
}

interface ArticleFileRecord {
  filePath: string
  slug: string
  locale: ArticleLocale
}

interface ArticlesRoot {
  mode: ContentSourceMode
  root: string
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function getArticlesRoot() {
  const privatePath = process.env.PRIVATE_BLOG_CONTENT_PATH?.trim()

  if (privatePath && (await pathExists(privatePath))) {
    return {
      mode: "private-repo",
      root: privatePath,
    } satisfies ArticlesRoot
  }

  if (privatePath && !(await pathExists(privatePath))) {
    console.warn(
      `[mdxArticles] PRIVATE_BLOG_CONTENT_PATH is set but not found: ${privatePath}. Falling back to tracked sample content.`
    )
  }

  return {
    mode: "tracked-fallback",
    root: FALLBACK_ARTICLES_DIR,
  } satisfies ArticlesRoot
}

async function listArticleFiles() {
  const articlesRoot = await getArticlesRoot()
  const hasLocaleSubdirectories = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      exists: await pathExists(path.join(articlesRoot.root, locale)),
    }))
  )

  if (hasLocaleSubdirectories.some((entry) => entry.exists)) {
    const records = await Promise.all(
      hasLocaleSubdirectories
        .filter((entry): entry is { locale: ArticleLocale; exists: true } => entry.exists)
        .map(async ({ locale }) => {
          const localeDir = path.join(articlesRoot.root, locale)
          const fileNames = await fs.readdir(localeDir)

          return fileNames
            .filter((fileName) => fileName.endsWith(".mdx"))
            .map((fileName) => ({
              filePath: path.join(localeDir, fileName),
              slug: fileName.replace(/\.mdx$/, ""),
              locale,
            }))
        })
    )

    return records.flat()
  }

  const fileNames = await fs.readdir(articlesRoot.root)

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => ({
      filePath: path.join(articlesRoot.root, fileName),
      slug: fileName.replace(/\.mdx$/, ""),
      locale: "zh" as const,
    }))
}

async function readArticleFile(record: ArticleFileRecord) {
  return fs.readFile(record.filePath, "utf8")
}

function normalizeArticleRecord(
  record: ArticleFileRecord,
  frontmatter: Frontmatter
) {
  return {
    slug: frontmatter.slug ?? record.slug,
    title: frontmatter.title ?? record.slug,
    description: frontmatter.description ?? "",
    publishedOn: frontmatter.publishedOn ?? "",
    locale: frontmatter.locale ?? record.locale,
    source: "private-mdx" as const,
  }
}

export async function getMdxArticleList(locale?: string) {
  const articleFiles = await listArticleFiles()

  const articles = await Promise.all(
    articleFiles.map(async (record) => {
        const rawContent = await readArticleFile(record)
        const { data } = matter(rawContent)
        const frontmatter = data as Frontmatter

        return {
          ...normalizeArticleRecord(record, frontmatter),
          isPublished: frontmatter.isPublished ?? true,
        }
      })
  )

  const filtered = articles
    .filter((article) => article.isPublished)
    .filter((article) => (locale ? article.locale === locale : true))

  return filtered.sort((a, b) =>
    new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime()
  )
}

export async function getMdxArticle(slug: string, locale?: string) {
  const articleFiles = await listArticleFiles()
  const matchedRecord = articleFiles.find((record) => {
    const localeMatches = locale ? record.locale === locale : true
    return record.slug === slug && localeMatches
  })

  if (!matchedRecord) {
    throw new Error(`MDX article not found: ${slug}`)
  }

  const rawContent = await readArticleFile(matchedRecord)
  const parser = new BlogParser(rawContent)
  const { header, htmlContent, headings } = parser.getParserdContent()
  const { data } = matter(rawContent)
  const frontmatter = data as Frontmatter
  const normalized = normalizeArticleRecord(matchedRecord, frontmatter)

  return {
    ...normalized,
    title: normalized.title ?? header.title ?? slug,
    description: normalized.description,
    publishedOn: normalized.publishedOn ?? header.date ?? "",
    htmlContent,
    headings,
  } satisfies MdxArticle
}

export async function getMdxArticlesSourceMode() {
  const articlesRoot = await getArticlesRoot()
  return articlesRoot.mode
}
