import { tool } from "ai"
import { z } from "zod"
import { getMdxArticleList } from "@/app/service/mdxArticles"

export const getProfileSummaryTool = tool({
  description:
    "Get Jie's profile summary including skills, experience, and contact info. Use this when the user asks about Jie's background, skills, experience, or wants a general overview.",
  inputSchema: z.object({}),
  execute: async () => ({
    name: "Developer / 开发者",
    role: "Front-End Developer & AI Prompt Engineer",
    location: "Hangzhou, China",
    experience:
      "~several years professional experience at 某金融科技公司, with strong independent delivery capability",
    focus: [
      "React / Next.js / TypeScript",
      "Polished UI engineering & design-system thinking",
      "Maintainable front-end architecture",
      "Practical AI product integration (LLM + Agent)",
    ],
    productAreas: [
      "Hero showcase & landing pages",
      "Blog / issue tracker system (bilingual)",
      "AI chatbot / playground",
      "Responsive design & dark mode",
    ],
    contact: {
      email: "jie.liao.dev@gmail.com",
      github: "github.com/JieLuis",
      linkedin: "linkedin.com/in/jieliao",
    },
  }),
})

export const listProjectsTool = tool({
  description:
    "List Jie's portfolio projects with descriptions and tech stacks. Use this when the user asks about projects, portfolio pieces, or what Jie has built.",
  inputSchema: z.object({}),
  execute: async () => [
    {
      title: "Personal Portfolio & Blog",
      description:
        "A recruiter-facing portfolio with bilingual UX, MDX-based blog, AI playground, and pixel-first retro design system.",
      tech: [
        "Next.js 14",
        "TypeScript",
        "Tailwind CSS",
        "Prisma",
        "Vercel AI SDK",
      ],
      highlights: ["Bilingual i18n", "Dark mode", "AI chatbot", "Responsive"],
    },
    {
      title: "Blog System",
      description:
        "A content management surface that blends database-driven blogs with MDX-powered long-form articles.",
      tech: ["Next.js", "Prisma", "PostgreSQL", "MDX", "shadcn/ui"],
      highlights: ["DB + MDX hybrid", "Category filtering", "Pagination"],
    },
    {
      title: "AI Lab (this page)",
      description:
        "An interactive AI playground built with Vercel AI SDK, featuring streaming chat, tool-calling agent, and generative UI blocks.",
      tech: [
        "Vercel AI SDK v6",
        "ToolLoopAgent",
        "Streaming UI",
        "Generative UI",
      ],
      highlights: [
        "Tool calling",
        "Structured UI generation",
        "Streamed responses",
      ],
    },
  ],
})

export const searchArticlesTool = tool({
  description:
    "Search Jie's blog articles by keyword or topic. Use this when the user asks about blog posts, articles, or writing on a specific topic.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Search keyword or topic, e.g. 'React', 'Next.js', 'AI', 'CSS'",
      ),
    limit: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .default(5)
      .describe("Maximum number of articles to return"),
  }),
  execute: async (input: { query: string; limit: number }) => {
    try {
      const articles = await getMdxArticleList()
      const lowerQuery = input.query.toLowerCase()
      const matched = articles
        .filter(
          (a) =>
            a.title.toLowerCase().includes(lowerQuery) ||
            a.description.toLowerCase().includes(lowerQuery) ||
            a.slug.toLowerCase().includes(lowerQuery),
        )
        .slice(0, input.limit)

      return matched.map((a) => ({
        slug: a.slug,
        title: a.title,
        description: a.description,
        publishedOn: a.publishedOn,
        locale: a.locale,
      }))
    } catch {
      return []
    }
  },
})

export const buildUiBlockTool = tool({
  description:
    "Build or update a structured UI artifact in the workspace. Use this when the user asks to show, display, generate, or refine a visual element like a profile card, project grid, article list, timeline, comparison table, or role-fit report. Returns a structured payload that the frontend renders in the workspace panel.",
  inputSchema: z.object({
    artifactType: z
      .enum([
        "profile-card",
        "project-grid",
        "article-summary",
        "timeline",
        "comparison-table",
        "role-fit-report",
      ])
      .describe("The type of artifact to generate or update"),
    operation: z
      .enum(["append", "replace", "update"])
      .default("append")
      .describe(
        "append = add a new artifact; replace = replace the main artifact of this type; update = update an existing artifact of this type",
      ),
    title: z
      .string()
      .optional()
      .describe("Optional heading/title for the artifact"),
    summary: z
      .string()
      .optional()
      .describe("Short receipt text shown in chat, e.g. 'Generated project grid'"),
    focus: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether to automatically focus this artifact in the workspace"),
    artifactId: z
      .string()
      .optional()
      .describe("When operation is update, optional target artifact ID"),
    data: z
      .record(z.unknown())
      .describe(
        "Structured data payload for the artifact. Schema depends on artifactType.",
      ),
  }),
  execute: async (input: {
    artifactType: string
    operation: string
    title?: string
    summary?: string
    focus?: boolean
    artifactId?: string
    data: Record<string, unknown>
  }) => input,
})
