# 🌐 Bilingual (中文 / English) i18n Refactor Plan

> **Project:** Jie Liao's Personal Blog & Portfolio Site  
> **Stack:** Next.js 14 (App Router), TypeScript, Prisma (PostgreSQL), TailwindCSS, Radix UI, Framer Motion  
> **Goal:** Transform the site into a fully bilingual Chinese/English website with clean language switching UX

---

## 📊 Current State Analysis

### Architecture Overview

```mermaid
graph TD
  A[app/layout.tsx] --> B[NavBar.tsx]
  A --> C[DynamicBezierCurve]
  C --> D[Hero.tsx]
  A --> E[page.tsx - Home]
  E --> F[SummaryHeader]
  E --> G[PostSummary → BlogSummary + BlogChart + LatestBlogs]
  E --> H[Contact.tsx]
  I[/blogs] --> J[BlogTable.tsx]
  I --> K[BlogStatusFilter.tsx]
  I --> L[IssueActions.tsx]
  M[/blogs/id] --> N[IssueDetails.tsx]
  M --> O[Wind.tsx / IssueForm.tsx]
  B --> P[DesktopNav.tsx]
  B --> Q[MobileNav.tsx]
```

### Current Language Status (Mixed State)

| Component | Current Lang | Text Found |
|---|---|---|
| `Hero.tsx` | Mixed | `"Heya I'm"` (EN), `"廖永杰"` (CN) type animation |
| `SummaryHeader.tsx` | CN | `"我的博客总结"` |
| `BlogSummary.tsx` | CN | `"Web开发"`, `"科技类"`, `"非技术类"` |
| `LatestBlogs.tsx` | CN | `"最近的博客"` |
| `Contact.tsx` | CN | `"联系我"`, `"您的名字"`, `"您的邮箱"`, `"消息"` |
| `projects.tsx` | CN | `"我的项目"` |
| `BlogTable.tsx` | CN | `"标题"`, `"博客类型"`, `"创建于"` |
| `BlogStatusFilter.tsx` | CN | `"全部"`, `"Web开发"`, `"科技类"`, `"非技术类"` |
| `DesktopNav.tsx` | CN | `"文章"`, `"关于我"` |
| `MobileNav.tsx` | CN | `"我的博客"` |
| `IssueActions.tsx` | CN | `"新建博客"` |
| `ProjectsDetail.tsx` | CN | `"该项目的github链接/上线网址不存在..."` |
| `IssueForm.tsx` | EN | `"Title"`, `"Description"`, `"Submit New Issue"`, `"Update Issue"` |
| `layout.tsx` metadata | EN | Full English metadata |
| `page.tsx` metadata | EN | `"Jie's Home Page"` |
| `blogs/page.tsx` metadata | EN | `"Blogs List"` |
| `blogs/[id]/page.tsx` metadata | EN | `"Details of issue"` |
| `app/blogs/[id]/IssueDetails.tsx` | TBD | Needs review |

> **Key Observation:** The site is already in a mixed state – UI strings lean Chinese, metadata leans English. The blog *content* in the DB (Issue model `title` + `description`) is probably bilingual-mixed too and will need a language tag on the data model.

---

## 🏗️ Architecture Decision: Approach Chosen

### ✅ Recommended: Next.js App Router Built-In i18n with `next-intl`

Use **`next-intl`** (the industry-standard i18n library for Next.js App Router). This gives:
- URL-based language routing: `/en/...` and `/zh/...`
- Server Component support (perfect for App Router)
- Type-safe translations
- No extra runtime cost for unused language bundles

**Alternative considered & rejected:** `i18next` / `react-i18next` — works but adds client-side bundle weight and is more complex to set up with App Router server components.

---

## 📁 New File Structure

```
app/
├── [locale]/                    ← NEW: locale segment wraps all pages
│   ├── layout.tsx               ← Root layout (moved here, locale-aware)
│   ├── page.tsx                 ← Home page
│   ├── blogs/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   └── edit/page.tsx
│   │   └── new/page.tsx
│   └── ...
├── api/                         ← Stay at root (locale-independent)
│   └── ...
├── auth/                        ← Stay at root
└── messages/                    ← NEW: Translation files
    ├── en.json
    └── zh.json

middleware.ts                    ← Updated for locale routing
```

---

## 📝 Translation Files Structure

### `app/messages/en.json`
```json
{
  "nav": {
    "blogs": "Articles",
    "aboutMe": "About Me",
    "myBlog": "My Blog"
  },
  "hero": {
    "greeting": "Heya I'm",
    "typeSequence": ["Jie", "a web developer", "廖永杰"]
  },
  "home": {
    "blogSummary": "My Blog Summary",
    "myProjects": "My Projects",
    "contactMe": "Contact Me",
    "webDev": "Web Development",
    "tech": "Tech",
    "nonTech": "Non-Tech",
    "latestBlogs": "Latest Blogs",
    "loadingMore": "Loading..."
  },
  "blogs": {
    "title": "Blog Title",
    "type": "Blog Type",
    "createdAt": "Created At",
    "filterAll": "All",
    "webDev": "Web Dev",
    "tech": "Tech",
    "nonTech": "Non-Tech",
    "filterPlaceholder": "Filter by Type",
    "newBlog": "New Blog",
    "listTitle": "Blogs",
    "listDescription": "View all of my blogs"
  },
  "contact": {
    "heading": "Contact Me",
    "yourName": "Your Name",
    "yourEmail": "Your Email",
    "message": "Message",
    "send": "Send",
    "successMsg": "Your email has been sent!",
    "limitMsg": "You can only send once per day"
  },
  "blogForm": {
    "titlePlaceholder": "Title",
    "descriptionPlaceholder": "Description",
    "submitNew": "Submit New Blog",
    "update": "Update Blog",
    "errorMsg": "An unexpected error occurred."
  },
  "projects": {
    "noLink": "This project's GitHub / live URL does not exist..."
  },
  "skills": {
    "heading": "Skill",
    "toolkits": "Toolkits",
    "education": "Education"
  },
  "meta": {
    "homeTitle": "Jie Liao — Front-End Developer & AI Prompt Engineer",
    "homeDescription": "Portfolio of Jie Liao — a front-end developer specializing in React, Next.js, TypeScript, and AI.",
    "blogsTitle": "Blogs List",
    "blogsDescription": "View all of my blogs"
  }
}
```

### `app/messages/zh.json`
```json
{
  "nav": {
    "blogs": "文章",
    "aboutMe": "关于我",
    "myBlog": "我的博客"
  },
  "hero": {
    "greeting": "你好，我是",
    "typeSequence": ["Jie", "前端开发者", "廖永杰"]
  },
  "home": {
    "blogSummary": "我的博客总结",
    "myProjects": "我的项目",
    "contactMe": "联系我",
    "webDev": "Web开发",
    "tech": "科技类",
    "nonTech": "非技术类",
    "latestBlogs": "最近的博客",
    "loadingMore": "加载中..."
  },
  "blogs": {
    "title": "标题",
    "type": "博客类型",
    "createdAt": "创建于",
    "filterAll": "全部",
    "webDev": "Web开发",
    "tech": "科技类",
    "nonTech": "非技术类",
    "filterPlaceholder": "按博客类型分类",
    "newBlog": "新建博客",
    "listTitle": "博客列表",
    "listDescription": "查看我所有的博客文章"
  },
  "contact": {
    "heading": "联系我",
    "yourName": "您的名字",
    "yourEmail": "您的邮箱",
    "message": "消息",
    "send": "发送",
    "successMsg": "您的邮件已送达！",
    "limitMsg": "您每天仅可以发送一次邮箱"
  },
  "blogForm": {
    "titlePlaceholder": "标题",
    "descriptionPlaceholder": "描述",
    "submitNew": "提交新博客",
    "update": "更新博客",
    "errorMsg": "发生了未知错误"
  },
  "projects": {
    "noLink": "该项目的github链接/上线网址不存在..."
  },
  "skills": {
    "heading": "技能",
    "toolkits": "工具集",
    "education": "教育经历"
  },
  "meta": {
    "homeTitle": "廖永杰 — 前端开发工程师 & AI 提示词工程师",
    "homeDescription": "廖永杰（Jie Liao）的作品集——专注于 React、Next.js、TypeScript 和 AI 集成的前端开发者。",
    "blogsTitle": "博客列表",
    "blogsDescription": "查看我所有的博客文章"
  }
}
```

---

## 🔧 Implementation Phases

### Phase 0 — Preparation (1 day)

1. **Install `next-intl`**
   ```bash
   npm install next-intl
   ```

2. **Create `i18n.ts` config file** at project root:
   ```ts
   import { getRequestConfig } from 'next-intl/server'
   
   export default getRequestConfig(async ({ locale }) => ({
     messages: (await import(`./app/messages/${locale}.json`)).default
   }))
   ```

3. **Update `next.config.js`** to use `next-intl` plugin:
   ```js
   const withNextIntl = require('next-intl/plugin')('./i18n.ts')
   module.exports = withNextIntl({ /* existing config */ })
   ```

4. **Update `middleware.ts`** for locale detection + redirect:
   ```ts
   import createMiddleware from 'next-intl/middleware'
   
   export default createMiddleware({
     locales: ['en', 'zh'],
     defaultLocale: 'zh'   // Default to Chinese for China-first UX
   })
   
   export const config = {
     matcher: ['/((?!api|_next|.*\\..*).*)']
   }
   ```

> [!IMPORTANT]
> The `defaultLocale: 'zh'` means visiting `/` will auto-redirect to `/zh`. Change to `'en'` if you prefer English-first.

---

### Phase 1 — Routing Restructure (1–2 days)

1. **Create `app/[locale]/` directory** and move all page routes into it:
   - `app/page.tsx` → `app/[locale]/page.tsx`
   - `app/layout.tsx` → `app/[locale]/layout.tsx`
   - `app/blogs/**` → `app/[locale]/blogs/**`
   - Keep `app/api/**` at root (unchanged, locale-independent)

2. **Update `[locale]/layout.tsx`** to set html `lang` attribute dynamically:
   ```tsx
   export default function RootLayout({ children, params: { locale } }) {
     return (
       <html lang={locale}>
         ...
       </html>
     )
   }
   ```

3. **Update `generateStaticParams`** in layout for static generation:
   ```ts
   export function generateStaticParams() {
     return [{ locale: 'en' }, { locale: 'zh' }]
   }
   ```

---

### Phase 2 — Language Switcher UI (0.5–1 day)

Add a language toggle to the NavBar (both Desktop and Mobile):

```tsx
// New: LanguageToggle.tsx
'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next-intl/client'

const LanguageToggle = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'zh' ? 'en' : 'zh' })
  }

  return (
    <button onClick={toggle} className="nav-link">
      {locale === 'zh' ? 'EN' : '中文'}
    </button>
  )
}
```

**Add to `DesktopNav.tsx`** in the right-side icons row (next to the dark mode toggle).  
**Add to `MobileNav.tsx`** in the dropdown menu.

---

### Phase 3 — Component-by-Component Migration (3–5 days)

Migrate each component to consume translations via `useTranslations` (client) or `getTranslations` (server). Below is the complete migration checklist:

#### 3.1 Layout & Navigation

- [ ] **`app/[locale]/layout.tsx`** — Update metadata to use `getTranslations('meta')`
- [ ] **`DesktopNav.tsx`** — Replace `"文章"`, `"关于我"` with `t('nav.blogs')`, `t('nav.aboutMe')`
- [ ] **`MobileNav.tsx`** — Replace `"我的博客"` with `t('nav.myBlog')`, update `Icon` switch case

#### 3.2 Home Page Components

- [ ] **`Hero.tsx`** — Replace `"Heya I'm"` greeting and `TypeAnimation` sequence  
- [ ] **`SummaryHeader.tsx`** — Replace `"我的博客总结"` with `t('home.blogSummary')`  
- [ ] **`BlogSummary.tsx`** — Replace category labels `"Web开发"`, `"科技类"`, `"非技术类"`  
- [ ] **`LatestBlogs.tsx`** — Replace `"最近的博客"`  
- [ ] **`projects.tsx`** — Replace `"我的项目"`, `"加载中..."`  
- [ ] **`Contact.tsx`** — Replace all form labels including `"联系我"`, `"您的名字"`, `"消息"` etc.  
- [ ] **`AboutMe.tsx`** — Replace `"Skill"`, `"Toolkits"`, `"Education"` labels  

#### 3.3 Blog List Page (`/blogs`)

- [ ] **`BlogTable.tsx`** — Replace column headers `"标题"`, `"博客类型"`, `"创建于"`  
- [ ] **`BlogStatusFilter.tsx`** — Replace all status labels, placeholder text  
- [ ] **`IssueActions.tsx`** — Replace `"新建博客"` button text  

#### 3.4 Blog Detail Page (`/blogs/[id]`)

- [ ] **`IssueDetails.tsx`** — Review and replace any hardcoded strings  
- [ ] **`DeleteIssueButton.tsx`** / **`EditIssueButton.tsx`** — Button text  
- [ ] **`AssigneeSelect.tsx`** — Any labels  

#### 3.5 Blog Form (`/blogs/new` & `/blogs/[id]/edit`)

- [ ] **`IssueForm.tsx`** — Replace `"Title"`, `"Description"`, `"Submit New Issue"`, `"Update Issue"`, `"An unexpected error occurred."`  

#### 3.6 Shared/Utility Components

- [ ] **`ProjectsDetail.tsx`** — Replace Dialog error message  
- [ ] **`IssueStatusBadge.tsx`** — Status badge labels (FINISHED, IN_PROGRESS, CLOSED → display strings)  
- [ ] **`Pagination.tsx`** — Any text labels  

---

### Phase 4 — Database / Content i18n (1–2 days)

> [!WARNING]
> This is the most complex part. Blog **content** (Issue model `title` + `description`) is stored in the database. You have two approaches:

#### Option A — Language Column (Simpler ✅ Recommended)

Add a `language` field to the `Issue` model:
```prisma
model Issue {
  // ...existing fields...
  language  String  @default("zh")  // 'zh' or 'en'
}
```
- Filter by `language` in blog queries
- Show only blogs matching the current locale
- Pros: Simple, easy to implement
- Cons: Blog content is NOT translated (one blog = one language only)

#### Option B — Separate Translation Tables (Complex, Full i18n)

Create `IssueTranslation` model:
```prisma
model Issue {
  id           Int                @id @default(autoincrement())
  status       Status             @default(IN_PROGRESS)
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
  translations IssueTranslation[]
  likes        Int                @default(0)
}

model IssueTranslation {
  id          Int    @id @default(autoincrement())
  issueId     Int
  locale      String // 'zh' or 'en'
  title       String @db.VarChar(255)
  description String @db.Text
  issue       Issue  @relation(fields: [issueId], references: [id])
  @@unique([issueId, locale])
}
```
- Pros: True bilingual content — same blog has both CN and EN versions
- Cons: Requires DB migration, existing data migration script, more complex queries

> [!TIP]
> **Recommendation:** Start with **Option A** for a quick win. Plan Option B as a future enhancement when you start writing bilingual content.

---

### Phase 5 — SEO & Metadata i18n (0.5 day)

Update metadata in each page to be locale-aware:

```tsx
// app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'zh': '/zh',
      }
    }
  }
}
```

Add `<link rel="alternate" hreflang="...">` tags for Google's multilingual SEO.

---

### Phase 6 — Testing & Polish (1 day)

- [ ] Test language switching persists across page navigation
- [ ] Test that default locale redirect works (`/` → `/zh`)
- [ ] Test all metadata changes per locale
- [ ] Verify `html[lang]` attribute switches correctly
- [ ] Test mobile nav language toggle
- [ ] Test blog filtering works across locales
- [ ] Verify email form validation messages are translated
- [ ] Check `localStorage` key for email rate limit is locale-independent

---

## 📦 Package to Install

```bash
npm install next-intl
```

That's the only new dependency. No other packages needed.

---

## ⏱️ Estimated Timeline

| Phase | Description | Est. Time |
|---|---|---|
| Phase 0 | Install & configure `next-intl` | 0.5 day |
| Phase 1 | Routing restructure (`app/[locale]/`) | 1–2 days |
| Phase 2 | Language switcher UI | 0.5 day |
| Phase 3 | Component migrations (all text strings) | 3–5 days |
| Phase 4 | DB schema update (Option A) | 1 day |
| Phase 5 | SEO / metadata i18n | 0.5 day |
| Phase 6 | Testing & polish | 1 day |
| **Total** | | **~8–11 days** |

---

## ⚠️ Key Risks & Gotchas

> [!WARNING]
> **Dynamic imports of message files** — `next-intl` uses `import()` for locale messages. Ensure `app/messages/` is in the correct location relative to your `i18n.ts` config.

> [!CAUTION]
> **`DesktopNav.tsx` fetches blog title via `axios` and puts it in breadcrumb** — this title comes from the DB and may need to be served in the right language. If you go with Option A (language column), filter the blog fetch by locale too.

> [!NOTE]
> **`TypeAnimation` sequence in `Hero.tsx`** — the animation array `["Jie", 1500, "a web developer", 1500, "廖永杰", 1500]` should be sourced from the translation file as an array, then used in the component. This requires special handling since JSON arrays work fine here.

> [!NOTE]
> **`MobileNav.tsx` `Icon` component** uses a `switch(label)` — after i18n, the `label` will change. Refactor to use a `type` property on the link object instead of matching on translated label text.

> [!TIP]
> **Persist language preference** — Store the user's language preference in `localStorage` or a cookie and use it when the user navigates directly to `/` (before the middleware redirect). `next-intl` supports cookie-based locale detection natively.

---

## 🎯 Success Criteria

- [ ] `/en` and `/zh` routes both work independently
- [ ] Language switcher in NavBar switches both route and all UI text
- [ ] All hardcoded Chinese strings replaced with translation keys
- [ ] All hardcoded English strings replaced with translation keys
- [ ] `html[lang]` attribute correctly set to `"en"` or `"zh"`
- [ ] SEO metadata served in the correct language per route
- [ ] Blog list filters work in both languages
- [ ] Contact form labels and error messages translated
- [ ] `hreflang` alternate links present in HTML head
- [ ] No remaining hardcoded language strings in any component

