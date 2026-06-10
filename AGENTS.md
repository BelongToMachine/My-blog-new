# AGENTS.md — Jie's Portfolio & Blog

## Project Identity
- Jie's production portfolio, blog, and AI skill-showcase. Treat every change as recruiter-facing.
- Current priority: **font normalization inside a broader styling transition**. This project is in the middle of moving from pixel-heavy font/style choices toward normalized font/styling conventions, but the active scope right now is fonts only.

## Non-Negotiable Rules
1. Minimal change; do not break business logic.
2. Preserve current visual look and motion unless explicitly asked to redesign.
3. Do not mix style refactors with unrelated logic changes.
4. Prefer normalization over reinvention; migrate incrementally.
5. During the current transition, keep broader pixel styling in place unless the task is explicitly about fonts/typography.

## Commands & Toolchain

### Package Manager
- **Use `bun` exclusively.** `package.json` pins `packageManager` to `bun@1.3.11`.
- `package.json` name: `jie-blog`, version `0.2.0`.

### Scripts (from `package.json`)
- `bun dev` — `next dev --hostname 0.0.0.0`
- `bun build` — clones `Private-Blog-Content` repo (if on Vercel), then `next build`
- `bun start` — `next start`
- `bun lint` — `next lint` (extends `next/core-web-vitals`)
- `bun prisma:generate` — `prisma generate`
- `postinstall` — runs `prisma generate` automatically on install

### No Test Runner
- Despite `@playwright/test` and `playwright` in devDependencies, there are **no test configs, test files, or test scripts**. Do not run `bun test`.

### Manual Checks
- No `typecheck` script exists; run `bunx tsc --noEmit` manually when needed.
- TypeScript **strict mode**, `moduleResolution: "node"`, path alias `@/*` → root.

### Browser / E2E Validation
- Never start a browser/dev server validation flow unless Jie explicitly asks for it in the current prompt.
- Do not run Playwright, Browser, Chrome, visual smoke checks, or localhost page verification proactively.
- If visual verification could help, mention it as an optional next step instead of running it.

### Formatting
- Prettier: `semi: false`, `singleQuote: false` (double quotes), `tabWidth: 2`.
- ESLint: extends `next/core-web-vitals` only (`.eslintrc.json`).

## Architecture

### Routing & Locales
- Next.js 14 App Router (`next.config.js`, CommonJS).
- `app/page.tsx` redirects to the default locale (`zh`).
- All user-facing pages live under `app/[locale]/` (`en`, `zh`). Locale prefix is always present (`localePrefix: "always"`).
- `middleware.ts` — `next-intl` middleware with `localeDetection: true`, matcher excludes `api`, `_next`, static files.
- `next-intl` plugin wraps `next.config.js`; root `i18n.ts` loads messages from `app/messages/{locale}.json`.
- i18n routing defined in `app/i18n/routing.ts`; navigation helpers in `app/i18n/navigation.ts`.
- Non-localized routes (`app/articles/`, `app/blogs/`) exist for legacy compatibility/redirects only.
- `next.config.js` uses `reactStrictMode: true`.

### Layout Hierarchy
- `app/layout.tsx` — global root: metadata, `globals.css`, Radix UI Themes CSS, Pigment CSS, and a before-interactive theme script (prevents FOUC). Wraps children in `GlobalChatRuntimeProvider` + `@vercel/analytics`.
- `app/[locale]/layout.tsx` — application shell. **Provider order matters:**
  `NextIntlClientProvider` → `QueryClientProvider` → `ThemeProvider` → `RadixThemeProvider` → `NavBar` / `CursorManager` / `main` / `Footer` / `ReactQueryDevtools`.
- Main content offset: `padding-top: var(--app-nav-offset)` (3.5rem mobile, 4.75rem desktop).

### Component Layers
```
app/
├── layout.tsx, page.tsx                    # Root: metadata + redirect
├── globals.css                             # 1266 lines: tokens, base, utilities, keyframes
├── NavBar.tsx, CursorManager.tsx            # App shell pieces
├── QueryClientProvider.tsx, MetaDataProvider.tsx
├── BlogChart.tsx, BlogSummary.tsx, LatestBlogs.tsx, PostSummary.tsx, SummaryHeader.tsx
│
├── [locale]/
│   ├── layout.tsx, page.tsx               # Locale shell + homepage (AboutSections)
│   ├── ai/                                 # AI chat playground page
│   │   └── components/                     # ChatLandingState, ThreadSidebar, CompactChatHeader, etc.
│   ├── articles/                           # Article listing + [slug] detail
│   └── contact/                            # Contact form page
│
├── api/
│   ├── ai/chat/route.ts                    # POST — AI chat streaming (DeepSeek v4 Flash)
│   ├── ai/threads/                         # CRUD for chat threads + messages
│   ├── ai/articles/route.ts                # Article-related AI queries
│   └── contact/                            # Contact form: generate-email + send (Resend)
│
├── components/
│   ├── ui/                                 # shadcn/Radix primitives: button, card, input, textarea
│   ├── navbar/                             # DesktopNav, MobileNav, LanguageToggle, ThemeToggle, PixelGithubIcon
│   ├── about/                              # AboutSections, AboutPinnedHeroShell
│   ├── projects/                           # ProjectsSection, PixelProjectIcons
│   ├── system/                             # Pixel-themed UI: RetroPanel/Badge/Notice/StatCard/Toolbar,
│   │                                       #   GeekPanel, CodeWindow, TerminalPill, SectionHeading,
│   │                                       #   NavItem, NavTextButton, ActionIconButton, PixelMenuIcon, BlogHudCard
│   ├── ai-blocks/                          # AI-generated content blocks: ProfileCard, ProjectGrid,
│   │                                       #   ArticleSummary, Timeline, ComparisonTable
│   ├── ai-workspace/                       # WorkspacePanel, WorkspaceHeader, ArtifactList, ArtifactRenderer
│   └── (shared)                            # Footer, Hero, Dialog, Alter, ChartInner, DisappearText,
│                                           #   IIIDButton, Pagination, PixelAssistantPreview, SearchInput,
│                                           #   TooltipIcon, XContainer, color.ts
│
├── articles/_components/                   # Feature-local: ArticleBody, ArticleDetailLayout,
│                                           #   ArticleEnhancement, TableOfContent, Wind, PixelFan,
│                                           #   AiAgentInlineBlock, JQueryArticleExperience,
│                                           #   NextjsRenderingInlineBlock, HoverWrapper
├── context/                                # Providers: DarkMode, GlobalChatRuntime, RadixTheme, Scrollable
├── hooks/                                  # useTheme, useChatThreads, useThreadChat, useThreadWorkspace,
│                                           #   useWorkspaceSync, useIsOnScreen
├── lib/                                    # mapper, responsive
├── packages/                               # Special showcase: Screen, ClientComponent, ServerComponent
├── service/                                # BlogParser, Store (Zustand), ThemeService,
│                                           #   articleCodeHighlight, mdxArticles
├── types/                                  # ai-workspace.ts (361 lines), global.d.ts
└── design-system/                          # Design system reference page
```

### Styling System
- **Transition status**: The site is mid-migration from pixel font/style toward normalized font/styling. Current active work is limited to font/typography changes; broader styling cleanup is deferred unless explicitly requested.
- **Primary**: Tailwind CSS 3.4 + semantic tokens defined in `app/globals.css` (`@layer base`).
- **Plugins**: `tailwindcss-animate`, `@tailwindcss/typography`.
- **Dark mode**: `class` strategy (`.dark` class on `<html>`).
- **PostCSS**: Tailwind + Autoprefixer.
- **shadcn/ui**: configured via `components.json` — CSS variables mode, base color `slate`, aliases to `@/app/components/ui`.
- **Exceptions (CSS Modules)**: `app/articles/post.module.css`, `app/articles/_components/*.module.css`, `app/components/IIIDButton.module.css`.
- **Avoid**: new inline styles, new legacy token names, new global CSS selectors for component-local styling.

### Design Tokens (HSL custom properties)
| Token | Light (`:root`) | Dark (`.dark`) |
|---|---|---|
| `--background` | `210 30% 97%` | `210 30% 8%` |
| `--foreground` | `210 30% 10%` | `210 10% 92%` |
| `--primary` | `191 92% 36%` (teal/cyan) | `191 92% 56%` |
| `--secondary` | `52 85% 90%` (warm yellow) | `52 40% 20%` |
| `--muted` | `200 30% 93%` | `200 15% 18%` |
| `--accent` | `187 44% 92%` | `187 44% 20%` |
| `--radius` | `0rem` (fully square) | same |
| `--app-nav-offset` | `3.5rem` / `4.75rem` (mobile/desktop) | same |

### Custom Utility Classes (defined in `globals.css`)
Reuse these before inventing new patterns:
- **Layout**: `.app-shell`, `.section-shell`, `.content-page-shell`, `.panel-grid`
- **Cards**: `.pixel-card`, `.pixel-corners`, `.article-preview-card`, `.summary-stat-card`
- **Typography**: `.display-title`, `.pixel-heading`, `.display-kicker`, `.section-kicker`, `.section-copy`, `.terminal-label`, `.pixel-header-label`
- **Fonts**: `.font-pixel` (legacy transition surface during the font migration), `.font-editorial`, `.font-reading`, `.font-normal-mode`
- **AI Lab**: `.ai-lab-shell`, `.ai-lab-sidebar-pane`, `.ai-lab-chat-pane`, `.ai-lab-message-card--*`, `.ai-lab-composer`, `.ai-lab-composer-shell`, `.ai-lab-landing-panel`, `.ai-lab-pixel-button`, `.ai-lab-featured-chip`, `.ai-lab-pixel-menu-item`, `.ai-lab-workspace-pane`, `.ai-lab-workspace-drawer`
- **Data**: `.data-table-shell`, `.data-table-header`, `.data-table-row`
- **Pixels**: `.pixelated` (image-rendering), `.pixel-panel`, `.pixel-arrow`, `.pixel-divider`, `.pixel-title`, `.pixel-title-wrapper`
- **MDX**: `.mdx-index-shell`, `.mdx-index-copy`, `.mdx-index-card-title`, `.mdx-index-card-copy`
- **TOC**: `.pixel-toc`, `.pixel-toc-item`
- **Chart**: `.pixel-chart` (Recharts)
- **Other**: `.retro-select`, `.home-page-heading`, `.pixel-orb-shape`, `.ai-cta-shimmer`

### Responsive Breakpoints
- Tailwind: `sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1536`
- `responsive.config.js`: `tablet: 768`, `desktop: 1024`
- Container: centered, max-width `1500px` at `2xl`.

### State Management
- **Zustand** (`app/service/Store.ts`): 4 stores —
  - `useDefaultCursorStore`: magic cursor toggle
  - `useVirtualCursorStore`: cursor position, variant (`arrow`/`pointer`), overlap tracking
  - `useScrollableStore`: scrollable region tracking via named sources
  - `useReadingFontStore`: pixel/sans font toggle (persisted to localStorage)
- **TanStack Query v4**: server state caching via `QueryClientProvider` + `ReactQueryDevtools`.
- **AI Chat Runtime** (`app/context/GlobalChatRuntimeContext.tsx`): manages a registry of `@ai-sdk/react` `Chat` instances per thread with custom fetch transport to `/api/ai/chat`.
- **Theme**: CSS custom properties (`globals.css`) + `ThemeProvider` (`DarkModeContext.tsx`) + before-interactive inline script (FOUC prevention).

### AI SDK
- `ai` v6 with `@ai-sdk/openai` v3 and `@ai-sdk/react` v3.
- Model is fixed to DeepSeek v4 Flash (`DEEPSEEK_API_KEY` env var).
- `AI_THINKING_ENABLED` env toggle for reasoning tokens.
- Workspace artifacts: type definitions + Zod schemas in `app/types/ai-workspace.ts` (361 lines).

## Database & Prisma

### Schema (`prisma/schema.prisma`)
- PostgreSQL (`provider = "postgresql"`).
- Two models: `ChatThread` (id, userId, title, timestamps) → `ChatMessage` (id, threadId, role, content, parts, createdAt).
- Cascade delete on thread → messages.
- 4 tracked migrations in `prisma/migrations/`.

### Commands
- `bunx prisma generate` / `bun prisma:generate`
- `bunx prisma migrate dev --name <migration_name>`
- `bunx prisma studio`
- Track migrations in git. Verify consistency between source and production database before deployment.

### Environment Variables
Check `.env.example` for the full set. Key ones:
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `DEEPSEEK_API_KEY` | AI chat model (DeepSeek v4 Flash) |
| `AI_THINKING_ENABLED` | Toggle reasoning tokens (`true`/`false`) |
| `RESEND_API_KEY` | Transactional email for contact form |
| `CONTACT_RECIPIENT_EMAIL` | Destination for contact form submissions |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Production rate limiting |
| `PRIVATE_BLOG_CONTENT_PATH` | Local: absolute path to Private-Blog-Content repo; Vercel: `"private-blog-content"` (cloned during build) |
| `NEXT_PUBLIC_DEV_SECRET_TOKEN` | Local API protection |
| `NEXT_PUBLIC_DEV_MODE` | Dev mode toggle (used in `app/envConfig.ts`) |

## Code Conventions
- TypeScript, strict mode.
- **Default to Server Components**; add `"use client"` only when interactivity/hooks are required.
- PascalCase for components, camelCase for utilities/hooks.
- UI is bilingual: Chinese-first (`zh` default) with English where appropriate.
- Validation: Zod. Client state: Zustand. Server state: TanStack Query v4.
- Reuse `lib/utils.ts` `cn()` helper (clsx + tailwind-merge) for conditional classes.
- Local font: `BebasNeue` loaded via `next/font/local` from `public/fonts/` (`lib/fonts.ts`).
- Icons: `lucide-react` (primary), `@radix-ui/react-icons`, `@heroicons/react`, `react-icons`.
- Forms: `react-hook-form` + `@hookform/resolvers` + `zod`.
- Markdown: `react-markdown` + `remark-gfm` (content), `markdown-it` (SSG), `gray-matter` (frontmatter). Syntax highlighting: `shiki`.
- Animations: `framer-motion`.
- Charts: `recharts`.
- Toast: `react-hot-toast`.

## Git Branch Model (`knowledge.md`)
- `main` — backbone and blog updates. Always keep updated before branching.
- `feature/...`, `bugfix/...` — branch from `main`, merge back into `main`.
- `CN-pro` — Chinese production branch. Merge completed features/bugfixes into `main` first, then merge `main` into `CN-pro`.
- Do not modify `.gitignore` without explicit permission.

## Skill Usage (Brief)
Use skills sparingly and intentionally:
- `normalize` — token / design-system alignment.
- `polish` — finishing pass after substantial UI work.
- `frontend-design` — design direction when composition feels weak.
- `adapt` — responsive fixes.
- `extract` — repeated UI → reusable primitive.
- `harden` — edge cases, overflow, error states.
- `audit` — accessibility / quality review.
- `animate` — micro-interactions and motion.
- `arrange` — layout, spacing, visual hierarchy fixes.
- `bolder` — amplify safe designs.
- `colorize` — add strategic color.
- `clarify` — improve UX copy and microcopy.
- `critique` — UX review with scoring.
- `delight` — moments of joy and personality.
- `distill` — simplified clutter reduction.
- `onboard` — first-run and empty states.
- `optimize` — performance diagnostics.
- `overdrive` — technically ambitious implementations.
- `quieter` — tone down aggressive designs.
- `typeset` — typography improvements.
- `md-to-mdx-blog` — convert Markdown to bilingual MDX blog post.
- `deploy-to-vercel` — deploy to Vercel.
- `commit-when-done` — auto-commit finished work locally.
- `teach-impeccable` — project design context setup.

## References
- `knowledge.md` — branch strategy, Prisma workflow, CSS Modules explanation.
