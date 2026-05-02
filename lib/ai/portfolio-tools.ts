import { tool } from "ai"
import { z } from "zod"
import { getMdxArticleList } from "@/app/service/mdxArticles"
import { workspaceArtifactPayloadSchema } from "@/app/types/ai-workspace"

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

/* ─── Lenient schema for LLM tool calls ───
 * Some providers (MiniMax) serialize object parameters as JSON strings.
 * We accept both object and string, then normalize in execute.
 */

const buildUiBlockInputSchema = z.object({
  artifactType: z.enum([
    "profile-card",
    "project-grid",
    "article-summary",
    "timeline",
    "comparison-table",
    "role-fit-report",
  ]),
  operation: z.enum(["append", "replace", "update"]).default("append"),
  title: z.string().optional(),
  summary: z.string().optional(),
  focus: z.boolean().default(true),
  artifactId: z.string().optional(),
  surface: z.enum(["chat", "artifact"]).default("artifact"),
  reveal: z.boolean().default(false),
  priority: z.enum(["low", "high"]).default("low"),
  data: z.union([z.record(z.unknown()), z.string()]),
})

export const buildUiBlockTool = tool({
  description:
    "Build or update a structured UI artifact. Use this ONLY when the user explicitly asks for a visual summary, comparison, timeline, or structured report that is too dense for plain text.\n\n" +
    "Rules:\n" +
    "1. Default to text answers. Do NOT use this tool for simple Q&A, brief summaries, or single-item lookups.\n" +
    "2. Use this tool when the user says: 'show me', 'display', 'generate a table', 'create a timeline', 'compare...'\n" +
    "3. surface='chat' means the result should stay in the chat stream (default for simple results).\n" +
    "4. surface='artifact' means the result goes to the workspace panel (for dense structured data).\n" +
    "5. reveal=true means auto-expand the workspace panel. Only set true when the user explicitly asks to open/show the panel.\n" +
    "6. priority='high' for: comparison-table, timeline, role-fit-report. priority='low' for: profile-card, project-grid, article-summary.\n" +
    "7. Low-priority artifacts should usually use surface='chat' unless the user specifically wants them in the panel.",
  inputSchema: buildUiBlockInputSchema,
  execute: async (input) => {
    // Normalize: parse stringified data if needed
    let data = input.data
    if (typeof data === "string") {
      try {
        data = JSON.parse(data)
      } catch {
        data = {}
      }
    }
    return { ...input, data } as Record<string, unknown>
  },
})
