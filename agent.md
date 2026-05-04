# Agent Configuration — Jie's Personal Portfolio & Blog

## Identity

You are an AI development assistant for **Jie's personal website** — a portfolio, blog, and skill-showcase platform built with modern web technologies. Jie is a **front-end developer** focused on React, Next.js, TypeScript, and practical AI product integration. This project serves as a living demonstration of independent delivery capability, front-end engineering strength, and AI prompt engineering / product integration skills.

---

## Project Purpose

This is NOT a toy project — it is a **professional portfolio** designed to:

1. **Showcase front-end engineering skill**: Demonstrate mastery of React, Next.js, TypeScript, and modern CSS techniques (animations, responsive design, dark mode, etc.)
2. **Showcase AI prompt engineering ability**: The integrated AI chatbot (using OpenAI API) demonstrates Jie's ability to design prompts, handle multi-modal inputs (text + images), and build AI-powered features
3. **Prove remote-readiness**: The site itself — its quality, polish, and self-driven nature — is evidence that Jie can deliver production-grade work independently

---

## Tech Stack

| Layer             | Technology                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Framework**     | Next.js 14 (App Router, Server Components, Server Actions)                                             |
| **Language**      | TypeScript                                                                                             |
| **Styling**       | Tailwind CSS 3.4, CSS Modules, Radix UI Themes, Pigment CSS                                            |
| **UI Library**    | Radix UI (`@radix-ui/themes`), shadcn/ui components (`Button`, `Card`, `Input`, `Textarea`)            |
| **Animation**     | Framer Motion, react-type-animation                                                                    |
| **State**         | Zustand, React Context (ThemeContext)                                                                  |
| **Data Fetching** | TanStack React Query v4, Axios                                                                         |
| **Database**      | PostgreSQL (Supabase-hosted), Prisma ORM                                                               |
| **AI**            | MiniMax API (M2.5 model) via Vercel AI SDK                                                             |
| **Blog Engine**   | MDX content files + gray-matter frontmatter, Shiki syntax highlighting, markdown-it with TOC & anchors |
| **Forms**         | React Hook Form + Zod validation                                                                       |
| **Charts**        | Recharts                                                                                               |
| **Icons**         | Heroicons, React Icons, Lucide React, Radix Icons                                                      |
| **Fonts**         | Custom "flickering" font (Allura), Inter                                                               |

---

## Project Structure

```
issue_tracker/
├── app/
│   ├── page.tsx                 # Home page — Hero, PostSummary
│   ├── layout.tsx               # Root layout — providers, nav, theme
│   ├── NavBar.tsx               # Responsive nav (Desktop / Mobile switch)
│   ├── projects.tsx             # Projects showcase section
│   ├── globals.css              # Design tokens, Tailwind layers, custom utilities
│   │
│   ├── components/
│   │   ├── Hero.tsx             # Hero section with TypeAnimation + CodeBlocker
│   │   ├── AboutMe.tsx          # Skills, toolkits, education badges
│   │   ├── ProjectCard.tsx      # Individual project card with hover overlay
│   │   ├── ProjectsDetail.tsx   # Full projects grid
│   │   ├── ProjectTags.tsx      # Tag filter for projects
│   │   ├── Chatbot.tsx          # AI chatbot response renderer (code blocks parsing)
│   │   ├── navbar/
│   │   │   ├── DesktopNav.tsx   # Desktop navigation with animated breadcrumbs
│   │   │   ├── MobileNav.tsx    # Mobile navigation
│   │   │   └── DynamicBezierCurve.tsx  # Animated bezier curve background
│   │   └── ui/                  # shadcn/ui primitives (Button, Card, Input, Textarea)
│   │
│   ├── blogs/
│   │   ├── page.tsx             # Blog listing with status filter
│   │   ├── [id]/
│   │   │   ├── page.tsx         # Blog detail page
│   │   │   ├── IssueDetails.tsx # Blog content renderer
│   │   │   ├── Wind.tsx         # Animated wind effect
│   │   │   └── Cursor.tsx       # Custom magic cursor
│   │   └── _components/         # Blog-specific shared components
│   │
│   ├── api/
│   │   ├── blogs/               # Blog CRUD endpoints
│   │   ├── projects/            # Projects endpoint
│   │   ├── usecase/route.ts     # AI chatbot endpoint (text + vision)
│   │   └── services/api-client.ts
│   │
│   ├── service/
│   │   ├── Store.ts             # Zustand stores
│   │   ├── ThemeService.ts      # Theme/dark-mode CSS variable service
│   │   ├── BlogParser.ts        # Markdown parsing utilities
│   │   └── getBlogPostList.ts   # MDX file-based blog post loader
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── context/                 # React Context providers (DarkModeContext)
│   ├── packages/                # Custom packages (CodeBlocker / Shiki syntax highlighting)
│   ├── content/                 # MDX blog post files
│   └── design-system/           # Design system tokens / documentation
│
├── prisma/
│   ├── schema.prisma            # DB schema (Issue, Project, Tag, Dialog, User, etc.)
│   ├── client.ts                # Prisma client singleton
│   └── migrations/              # Migration history
│
├── public/                      # Static assets (images, fonts, scripts)
├── tailwind.config.js           # Tailwind config with custom design tokens
├── knowledge.md                 # Dev branch strategy & Prisma conventions
└── TODO.md                      # Feature backlog
```

---

## Key Features to Maintain & Enhance

### 1. Hero Section

- Animated type-writer effect cycling through "Jie", "a web developer", "开发者"
- Code block showcase displaying developer profile as a JS object
- Uses Framer Motion for entrance animations

### 2. Blog System

- Database-backed blog posts (Prisma/PostgreSQL) with CRUD
- MDX content files with frontmatter parsing
- Shiki-powered syntax highlighting for code blocks
- Blog filtering, sorting, pagination
- Custom animated cursor on blog pages
- Animated wind effect parallax

### 3. Projects Showcase

- Database-driven project cards with tag-based filtering
- Hover overlay with code/preview links
- Framer Motion scroll-triggered animations

### 4. AI Chatbot / Code Generator

- OpenAI integration (GPT-3.5 text + GPT-4-vision for image analysis)
- Prompt: "You are a code generator" — generates code from user descriptions
- Multi-modal: accepts text prompts and image uploads
- All conversations persisted to database (Dialog model)
- Response rendering with code block parsing and Shiki highlighting

### 5. Contact

- `mailto:` link in footer for direct email contact

### 6. Dark Mode / Theming

- Full light/dark mode support via ThemeContext + CSS variables
- Smooth transition animations between themes
- Nav, layout, and component colors all respect theme

### 7. Responsive Design

- Desktop/Mobile navigation switch at 768px
- Grid-based responsive layouts
- Mobile-optimized components

---

## Database Models (Prisma)

| Model     | Purpose                                           |
| --------- | ------------------------------------------------- |
| `ChatThread`  | AI conversation threads                     |
| `ChatMessage` | Individual messages within a thread         |

---

## Git Branching Strategy

- **`main`** — backbone + blog content updates
- **`feature/...`** — new features (branch from `main`)
- **`bugfix/...`** — bug fixes (branch from `main`)
- **`CN-pro`** — Chinese version production (merge features/bugfix into this, then main into this)

Always ensure `main` is up to date before creating new branches.

---

## Coding Conventions

1. **TypeScript everywhere** — no `any` unless absolutely necessary
2. **Server Components by default** — use `"use client"` only when needed (hooks, interactivity)
3. **CSS approach**: Tailwind utility classes as primary, CSS Modules for scoped styles, Radix UI theme tokens for design consistency
4. **Validation**: Zod schemas for all form validation
5. **State management**: Zustand for global state, React Context for theme, TanStack Query for server state
6. **File naming**: PascalCase for components, camelCase for utilities/hooks
7. **Bilingual UI**: Chinese (primary) with English labels where appropriate — this site targets both Chinese and international audiences
8. **Animation**: Framer Motion for all entrance/exit/hover animations
9. **Agent Instructions**: After updating code, do NOT run a test build unless explicitly specified that it is necessary.
10. **Agent Restrictions**: NEVER upload `.gitignore` file into GitHub without my permission.

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run Prisma Studio (DB GUI)
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name <migration_name>

# Deploy migrations (production)
npx prisma migrate deploy
```

---

## Environment Variables

The app requires the following environment variables (see `.env.example`):

- `DATABASE_URL` — PostgreSQL connection string
- `MINIMAX_API_KEY` — AI provider API key
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Rate limiting Redis

---

## What This Project Demonstrates (for recruiters/hiring managers)

| Competency                      | Evidence in this project                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **React / Next.js mastery**     | App Router, Server Components, dynamic routes, API routes, middleware, Suspense boundaries                     |
| **TypeScript proficiency**      | Fully typed components, Prisma-generated types, Zod schemas, generic hooks                                     |
| **Modern CSS & animations**     | Tailwind, CSS Modules, CSS variables for theming, Framer Motion animations, custom bezier curves               |
| **Full-stack capability**       | Prisma ORM, PostgreSQL, REST APIs, server actions, database migrations                                         |
| **AI / Prompt Engineering**     | OpenAI API integration, multi-modal prompts (text + vision), conversation persistence, code generation prompts |
| **State management**            | Zustand stores, React Context, TanStack Query for async state                                                  |
| **Form handling & validation**  | React Hook Form + Zod validation                                                                               |
| **Responsive design**           | Desktop/mobile nav switch, fluid grids, responsive typography                                                  |
| **Code quality & architecture** | Clean separation of concerns (service/, hooks/, components/, api/), design system, reusable UI components      |
| **DevOps awareness**            | Git branching strategy, Prisma migrations, Supabase recovery plan, environment configuration                   |
| **Self-driven & remote-ready**  | Entire project conceived, designed, and built independently                                                    |
