import { tool } from "ai"
import { z } from "zod"
import { getMdxArticleList } from "@/app/service/mdxArticles"

export const getProfileSummaryTool = tool({
  description:
    "Get Jie's profile summary including skills, experience, and contact info. Use this when the user asks about Jie's background, skills, experience, or wants a general overview.",
  inputSchema: z.object({}),
  execute: async () => ({
    name: "Jie Liao / 廖永杰",
    role: "Front-End Developer & AI Prompt Engineer",
    location: "Hangzhou, China",
    experience:
      "~1.5 years professional experience at State Street, with strong independent delivery capability",
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
      tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "Vercel AI SDK"],
      highlights: ["Bilingual i18n", "Dark mode", "AI chatbot", "Responsive"],
    },
    {
      title: "Issue Tracker / Blog System",
      description:
        "A content management surface that blends database-driven blogs with MDX-powered long-form articles.",
      tech: ["Next.js", "Prisma", "PostgreSQL", "MDX", "shadcn/ui"],
      highlights: ["DB + MDX hybrid", "Category filtering", "Pagination"],
    },
    {
      title: "AI Lab (this page)",
      description:
        "An interactive AI playground built with Vercel AI SDK, featuring streaming chat, tool-calling agent, and generative UI blocks.",
      tech: ["Vercel AI SDK v6", "ToolLoopAgent", "Streaming UI", "Generative UI"],
      highlights: ["Tool calling", "Structured UI generation", "Streamed responses"],
    },
  ],
})

export const searchArticlesTool = tool({
  description:
    "Search Jie's blog articles by keyword or topic. Use this when the user asks about blog posts, articles, or writing on a specific topic.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("Search keyword or topic, e.g. 'React', 'Next.js', 'AI', 'CSS'"),
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
            a.slug.toLowerCase().includes(lowerQuery)
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
    "Build a structured UI block for the portfolio page. Use this when the user asks to show, display, or generate a visual element like a profile card, project grid, article list, timeline, or comparison table. Returns a structured payload that the frontend renders with a fixed React component.",
  inputSchema: z.object({
    blockType: z
      .enum([
        "profile-card",
        "project-grid",
        "article-summary",
        "timeline",
        "comparison-table",
      ])
      .describe("The type of UI block to generate"),
    title: z
      .string()
      .optional()
      .describe("Optional heading/title for the block"),
    data: z
      .record(z.unknown())
      .describe("Structured data payload for the block. Schema depends on blockType."),
  }),
  execute: async (input: {
    blockType: string
    title?: string
    data: Record<string, unknown>
  }) => input,
})
