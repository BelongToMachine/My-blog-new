# AGENTS.md — Jie's Portfolio & Blog

## Project Identity
- Jie's production portfolio, blog, and AI skill-showcase. Treat every change as recruiter-facing.
- Current priority: **styling normalization** (converge on Tailwind + semantic tokens + shared UI primitives; CSS Modules only for complex isolated visuals).

## Non-Negotiable Rules
1. Minimal change; do not break business logic.
2. Preserve current visual look and motion unless explicitly asked to redesign.
3. Do not mix style refactors with unrelated logic changes.
4. Prefer normalization over reinvention; migrate incrementally.

## Commands & Toolchain

### Package Manager
- **Use `bun` exclusively.** `package.json` pins `packageManager` to `bun@1.3.11`.

### Scripts (from `package.json`)
- `bun dev` — Next.js dev server.
- `bun build` — production build.
- `bun lint` — `next lint` (eslint-config-next).
- `bun prisma:generate` — generate Prisma client. Also runs automatically on `postinstall`.

### No Test Runner
- Despite `@playwright/test` and `happy-dom` in dependencies, there are **no test configs, test files, or test scripts**. Do not run `bun test`.

### Manual Checks
- No `typecheck` script exists; run `bunx tsc --noEmit` manually when needed.

## Architecture

### Routing & Locales
- Next.js 14 App Router.
- `app/page.tsx` redirects to the default locale (`zh`).
- All user-facing pages live under `app/[locale]/` (`en`, `zh`). Locale prefix is always present (`localePrefix: "always"`).
- Non-localized routes (e.g. `app/blogs/page.tsx`) exist for legacy compatibility/redirects only.
- `next-intl` plugin wraps `next.config.js`; root `i18n.ts` loads messages from `app/messages/{locale}.json`.

### Layout Hierarchy
- `app/layout.tsx` — global root: metadata, `globals.css`, Radix UI Themes CSS, Pigment CSS, and a before-interactive theme script.
- `app/[locale]/layout.tsx` — application shell. **Provider order matters:**
  `NextIntlClientProvider` → `QueryClientProvider` → `ThemeProvider` → `RadixThemeProvider` → `NavBar` / `CursorManager` / `main` / `Footer`.

### Component Layers
- `app/components/ui/*` — reusable primitives (shadcn/Radix style).
- `app/components/*` — cross-page sections and shared product components.
- `app/components/navbar/*` — navigation-specific UI.
- `app/blogs/_components/*`, `app/articles/_components/*` — feature-local components.
- `app/packages/*` — special showcase / presentation helpers.
- Do not flatten everything into a single `components/` directory.

### Styling System
- **Primary**: Tailwind CSS 3.4 + semantic tokens defined in `app/globals.css`.
- **Exceptions**: CSS Modules for complex isolated animations or editorial blocks.
- **Avoid**: new inline styles, new legacy token names, new global CSS selectors for component-local styling.
- `globals.css` already defines many custom utilities (`.panel-grid`, `.pixel-card`, `.pixel-corners`, `.section-shell`, `.terminal-label`, `.display-title`, etc.). Reuse them before inventing new patterns.

## Database & Prisma
- PostgreSQL (`provider = "postgresql"` in `prisma/schema.prisma`).
- `DATABASE_URL` required.
- **Gotcha**: `.env.example` contains a MySQL connection string, but the schema is PostgreSQL. Trust the schema.
- Track migrations in git (`prisma/migrations/`).
- Commands:
  - `bunx prisma generate`
  - `bunx prisma migrate dev --name <migration_name>`
  - `bunx prisma studio`

## Environment Variables
Check `.env.example` for the full set. Key ones:
- `DATABASE_URL`
- `NEXT_PUBLIC_DEV_SECRET_TOKEN`
- `PRIVATE_BLOG_CONTENT_PATH` — local dev: absolute path to Private-Blog-Content repo; Vercel: `"private-blog-content"` (cloned during build)

## Code Conventions
- TypeScript, strict mode.
- **Default to Server Components**; add `"use client"` only when interactivity/hooks are required.
- PascalCase for components, camelCase for utilities/hooks.
- UI is bilingual: Chinese-first (`zh` default) with English where appropriate.
- Prettier: `semi: false`, `singleQuote: false`, `tabWidth: 2`.
- Validation: Zod. Client state: Zustand. Server state: TanStack Query v4. Auth: NextAuth.js with Prisma adapter.

## Git Branch Model
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

## References
- `CLAUDE.md` — full product context and feature descriptions.
- `knowledge.md` — branch strategy and Prisma workflow details.
