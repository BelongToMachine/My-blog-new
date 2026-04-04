# Codex Memory

## Project Identity

This repository is Jie's personal portfolio, blog, and AI skill-showcase site. Treat it as a production-facing portfolio project, not a toy app. The site should demonstrate:

- strong front-end engineering
- thoughtful AI integration and prompt engineering
- polished remote-ready execution

Jie is a front-end developer with about 1.5 years of professional experience at State Street. Keep that framing consistent in product, UX, copy, and implementation decisions.

## Current Mission

The current project priority is **styling normalization**.

This does **not** mean redesigning the entire site from scratch. It means progressively bringing the project onto a clearer, safer styling architecture centered on:

- Tailwind CSS for day-to-day styling
- CSS custom properties for tokens
- shared UI primitives and site-level composed components
- CSS Modules only where they are the best technical fit

The goal is to make the site feel more consistent, more maintainable, and more production-grade without flattening its personality.

## Non-Negotiable Rules

1. Minimal change always.
2. Do not break business logic.
3. Preserve recruiter-facing polish.
4. Prefer normalization over reinvention.
5. Keep migrations incremental and easy to verify.

When making styling changes:

- do not rewrite large sections of UI unless the task explicitly requires it
- when normalizing, do not break the current look of the website unless the user clearly asks for a visual revision
- do not mix style refactors with unrelated logic changes
- do not change data flow, API behavior, auth flow, routing behavior, or localization behavior unless required for the task
- do not remove distinctive motion or personality just to make components look more uniform

## Working Priorities

- preserve a polished, recruiter-facing experience
- prefer maintainable, production-grade solutions over hacks
- keep the portfolio quality bar high across UI, responsiveness, and interaction detail
- avoid changes that make the site feel generic or templated
- normalize styling architecture with the smallest safe surface area

## Styling Normalization Target

The target styling architecture for this repo is:

- `Tailwind CSS` as the primary styling layer for layout, spacing, typography, state, and responsive behavior
- `app/globals.css` as the home for shared design tokens, theme variables, and a limited set of global utilities
- `CSS custom properties` as the semantic token source of truth
- `app/components/ui/*` as the primary reusable primitive layer
- site-level shared composed components for repeated patterns such as headings, cards, messages, and controls
- `CSS Modules` only for complex one-off visuals, advanced interaction structures, or animations that are awkward in utilities

The project should move **away from fragmented styling choices** and toward one consistent model.

## What To Normalize Toward

### Primary Stack

- Tailwind CSS
- semantic CSS variables
- shadcn-style component variants where appropriate
- Radix primitives/themes when they support accessibility and composition cleanly

### Keep As Exceptions, Not Defaults

- CSS Modules for complex isolated animation or editorial presentation
- inline styles only when runtime values make them necessary

### Reduce Over Time

- repeated one-off class combinations for the same UI pattern
- old token names that duplicate newer semantic tokens
- component-local visual systems that bypass shared primitives without good reason
- style logic scattered across unrelated feature files

## Architecture Memory For Styling Normalization

### Route Structure

- `app/layout.tsx` is the global root: metadata, global CSS, Radix/Pigment imports, and early theme bootstrapping
- `app/page.tsx` redirects to the default localized route
- `app/[locale]/layout.tsx` is the actual application shell for user-facing pages
- `app/[locale]/page.tsx` is the main landing page
- `app/[locale]/blogs/*` contains localized issue/blog flows
- `app/[locale]/articles/*` contains localized article pages
- `app/[locale]/ai/*` contains the AI playground
- non-localized routes such as `app/blogs/page.tsx` mostly exist for legacy compatibility and redirects

Styling changes must respect locale routing and existing page behavior.

### Provider And App Shell Layer

The main provider chain lives in `app/[locale]/layout.tsx`. The order matters:

- `NextIntlClientProvider`
- `QueryClientProvider`
- `AuthProvider`
- `ThemeProvider`
- `RadixThemeProvider`
- shared shell UI like `NavBar`, `CursorManager`, and top-level `main`

Do not move styling concerns into provider logic unless absolutely necessary. Styling normalization should mainly happen through tokens, primitives, and component composition.

### Component Layering

The component tree is already mixed and should be normalized carefully rather than flattened:

- `app/components/ui/*`: reusable primitive-style building blocks
- `app/components/*`: cross-page sections and reusable product components
- `app/components/navbar/*`: navigation-specific UI
- `app/blogs/_components/*`: blog feature-specific components
- `app/articles/_components/*`: article-specific components
- `app/packages/*`: presentation helpers and special showcase pieces

Preferred future direction:

- shared primitives in `app/components/ui/*`
- shared site-level composed components for repeated visual patterns
- feature-local components kept near their domains

Do not dump everything into one flat `components/` layer.

### Styling System Memory

Current styling has historically mixed:

- Tailwind utilities
- CSS custom properties
- global CSS
- CSS Modules
- Radix UI Themes
- some older theme variable conventions
- some inline style-driven visual logic

Normalization should converge on this layered model:

1. semantic tokens in `app/globals.css`
2. Tailwind utilities mapped to those tokens
3. shared primitive and composed components
4. CSS Modules only where complexity justifies them

### Token Direction

Use semantic token naming as the main system, for example:

- surface: `--background`, `--card`, `--popover`
- text: `--foreground`, `--muted-foreground`
- brand: `--primary`, `--secondary`, `--accent`
- feedback: `--destructive`, plus future `--success` / `--warning` if needed
- structure: `--border`, `--input`, `--ring`
- shape: `--radius`
- future shared tokens where useful: shadows, motion timing, z-index layers, typography roles

When old variables still exist, prefer mapping and gradual migration instead of risky one-pass deletion.

### Product Areas To Protect While Normalizing

- Hero: identity, motion, and technical first impression
- Projects: card quality, tags, hover treatment, showcase credibility
- Blogs/issues: readability, filters, pagination, and technical content presentation
- Articles: MDX content quality and reading experience
- AI playground: experimental feel, code block quality, chat clarity
- Contact: validation, feedback, and trustworthy finish
- Theme and responsive UX: light/dark coherence and mobile quality

Normalization should improve consistency without erasing domain character.

## Refactor Strategy

When doing styling normalization, prefer this order:

1. normalize tokens and shared visual language first
2. strengthen or extend `app/components/ui/*`
3. extract repeated site-level patterns only when duplication is clear
4. migrate high-visibility pages before lower-priority pages
5. remove legacy styling paths only after replacements are proven

Suggested migration priority:

- home
- navigation
- projects
- contact
- blog list/detail
- articles
- AI playground and other experimental surfaces

## Implementation Rules

### Minimal-Change Refactoring

- change the smallest number of files that can safely solve the task
- prefer replacing repeated visual patterns over restructuring entire feature trees
- when updating styling, keep props, public component APIs, and rendered semantics stable unless a change is clearly beneficial and low-risk

### Business Logic Safety

- styling work must not change data fetching contracts
- styling work must not alter Prisma models or schema unless explicitly requested
- styling work must not change auth/session behavior
- styling work must not change form submission behavior except for visual state handling
- styling work must not break localization assumptions or bilingual content structure

### Component Reuse Rules

Prefer this path when building or editing UI:

1. reuse `app/components/ui/*` if the pattern already exists
2. extend a primitive with variants if the pattern is shared
3. create a site-level composed component if multiple domains use the same visual structure
4. use feature-local styling only when the pattern is truly domain-specific

Avoid:

- creating a new one-off button/card/input style when a shared primitive can be extended
- mixing old and new token names in the same component
- hardcoding colors that should come from tokens
- writing large chunks of ad hoc visual logic directly in business components

### Styling Technique Rules

Use Tailwind directly for:

- layout
- spacing
- grid/flex
- responsive behavior
- typography scale
- token-based foreground/background/border/ring usage

Use component variants for:

- button styles
- card shells
- input and textarea states
- badges, chips, alerts, messages
- icon buttons
- repeated heading/control patterns

Use CSS Modules for:

- complex animation-heavy structures
- unusual editorial/presentation blocks
- visuals that are hard to express cleanly with utilities

Avoid unless necessary:

- new runtime inline styles
- new legacy token names
- new global CSS selectors for component-local styling

## Skill Workflow Rules

Use relevant skills intentionally during styling work.

### Required Mindset

Skills should support the workflow, not replace judgment. Use the smallest set of skills that matches the task.

### Expected Skill Usage

- `normalize`: use for styling normalization, design-system alignment, token cleanup, shared pattern realignment, and reducing drift
- `polish`: use after implementation when the UI needs a final consistency and finish pass
- `frontend-design`: use when a task needs design direction, stronger composition ideas, or a more intentional visual approach without turning generic
- `adapt`: use when responsive behavior, breakpoints, or cross-device refinement are part of the task
- `extract`: use when repeated UI patterns should become reusable primitives or shared composed components
- `harden`: use when normalization touches fragile UI states such as overflow, form states, empty states, or error handling
- `clarify`: use when normalization also requires improving UX copy, labels, helper text, or status messages
- `audit`: use when the user asks for a review, health check, accessibility check, or broader quality assessment

### Typical Workflow

1. use `normalize` to align the implementation with the intended styling architecture
2. use `frontend-design` if the screen or component needs better design direction before editing
3. use `extract` if duplication should become a reusable primitive or shared site-level component
4. use `adapt` if responsive issues are involved
5. use `harden` if edge cases or state handling need protection
6. use `polish` for the finishing pass after the main work is done

Not every task needs every skill, but normalization work should usually involve `normalize`, and substantial UI work should usually end with `polish`.

## Coding Conventions

- use TypeScript throughout; avoid `any` unless there is no reasonable alternative
- default to Server Components; add `"use client"` only when needed
- prefer Tailwind first, CSS Modules when local scoping is the better fit
- use Zod for validation
- use Zustand for shared client state and React Query for server state where appropriate
- use PascalCase for components and camelCase for utilities/hooks
- keep UI bilingual where existing flows already expect Chinese-first with some English
- use Framer Motion for meaningful entrance, exit, and hover animation

## Repo-Specific Instructions

- prefer `pnpm` over `npm`
- do not run a production build after edits unless explicitly asked or genuinely required
- never upload or modify `.gitignore` for GitHub-related purposes without explicit permission
- keep Prisma migrations tracked in git
- when creating new branches, branch from updated `main`

## Branch Model

- `main`: backbone and blog updates
- `feature/...`: new features from `main`
- `bugfix/...`: fixes from `main`
- `CN-pro`: Chinese production branch that collects completed changes

## Environment Notes

Expect environment variables for:

- database connectivity
- NextAuth
- EmailJS
- OpenAI

Check `.env.example` before introducing any new required variable.

## Guidance For Future Codex Runs

- read [`CLAUDE.md`](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/CLAUDE.md) if a task needs fuller product context
- read [`knowledge.md`](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/knowledge.md) for branch and Prisma workflow details
- prefer edits that strengthen the portfolio's credibility for recruiters and clients
- preserve existing product intent unless the user explicitly wants repositioning
- for styling work, optimize for progressive normalization rather than big-bang rewrites
