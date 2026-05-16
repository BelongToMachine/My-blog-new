import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import BlogParser, { Heading } from "@/app/service/BlogParser"
import { toTitleCase } from "@/app/lib/mapper"

const LOCALES = ["zh", "en"] as const
type ArticleLocale = (typeof LOCALES)[number]

export interface MdxArticleListItem {
  slug: string
  title: string
  description: string
  publishedOn: string
  locale: ArticleLocale
  source: "private-mdx"
  category?: string
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
  category?: string
}

interface ArticleFileRecord {
  filePath: string
  slug: string
  locale: ArticleLocale
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function getArticlesRoot(): Promise<string | null> {
  const privatePath = process.env.PRIVATE_BLOG_CONTENT_PATH?.trim()
  if (privatePath && await pathExists(privatePath)) return privatePath

  const fallbackPaths = [
    path.join(process.cwd(), "private-blog-content"),
    path.join(process.cwd(), "app/content/mdx"),
  ]
  for (const p of fallbackPaths) {
    if (await pathExists(p)) return p
  }

  console.warn("[mdxArticles] No blog content path found. Returning empty article list.")
  return null
}

async function listArticleFiles() {
  const articlesRoot = await getArticlesRoot()
  if (!articlesRoot) return []

  const hasLocaleSubdirectories = await Promise.all(
    LOCALES.map(async (locale) => ({
      locale,
      exists: await pathExists(path.join(articlesRoot, locale)),
    }))
  )

  if (hasLocaleSubdirectories.some((entry) => entry.exists)) {
    const records = await Promise.all(
      hasLocaleSubdirectories
        .filter((entry): entry is { locale: ArticleLocale; exists: true } => entry.exists)
        .map(async ({ locale }) => {
          const localeDir = path.join(articlesRoot, locale)
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

  const fileNames = await fs.readdir(articlesRoot)

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => ({
      filePath: path.join(articlesRoot, fileName),
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
    title: toTitleCase(frontmatter.title ?? record.slug),
    description: frontmatter.description ?? "",
    publishedOn: frontmatter.publishedOn ?? "",
    locale: frontmatter.locale ?? record.locale,
    source: "private-mdx" as const,
    category: frontmatter.category,
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
  const { header, htmlContent, headings } = await parser.getParserdContent()
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
  return articlesRoot ? "private-repo" : "not-configured"
}
