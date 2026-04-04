# Progressive Blog Migration Plan

## Goal

Gradually move the personal blog system away from database-stored long-form content and toward MDX-style file authoring, while keeping the current database-backed blog alive during the transition.

At the same time, avoid putting personal blog content into this repository's git history.

This plan is designed for a portfolio/personal site where:

- blog publishing frequency is relatively low
- long-form content is more important than CMS-style editing
- the current database system still needs to exist for now
- privacy matters, and blog content should not become part of the public or long-term repo history

---

## Core Problem

There are two competing needs:

1. MDX is a better long-term authoring model for a personal technical blog
2. Personal article content should not appear in git commit history

Normally, MDX files live in the repo and are committed with code. That is convenient, but it permanently stores article content in git history.

So the trade-off is:

- use MDX as the writing format
- do **not** keep the real article files in tracked repo history

---

## Recommended Trade-Off

Use a **hybrid content architecture**.

### Keep two blog sources during migration

- `database blogs`
  - current Prisma-backed posts
  - continue working exactly as they do now
- `private mdx blogs`
  - new long-form articles written as MDX-style files
  - stored outside tracked git history

This allows:

- no risky one-shot migration
- progressive movement to file-authored content
- no need to fully abandon database right away
- privacy for personal article text

---

## Long-Term Direction

The long-term target should be:

- **MDX/private content** becomes the main source for long-form personal writing
- **database content** becomes a transitional legacy source, and possibly continues to hold only metadata or special features if needed

That means the site evolves into:

- file-authored articles for stable, evergreen writing
- DB retained only where it still brings clear value

---

## Content Storage Options

There are three realistic ways to keep MDX content out of this repo's tracked history.

### Option A: Git-ignored folder inside the repo

Example:

```txt
issue_tracker/
├── app/
├── prisma/
├── doc/
└── content-private/
    ├── zh/
    │   └── jquery-basic-syntax-practice.mdx
    └── en/
```

And add `content-private/` to `.gitignore`.

#### Pros

- simplest setup
- easy local development
- easy to read files directly from the app
- no personal article content in tracked repo history

#### Cons

- files do not automatically exist in production
- deployment needs an extra private sync step

#### Best use

Best first step for local experimentation and low-friction migration.

---

### Option B: Private separate repo for content

Put all blog content in a separate private repository.

Example:

```txt
private-blog-content/
├── zh/
│   └── jquery-basic-syntax-practice.mdx
└── en/
```

The main site reads from this private content repo during local development or deployment.

#### Pros

- content stays out of this main repo
- still gives version history for writing
- good separation of concerns

#### Cons

- more setup
- still creates git history, just in a private place
- deployment pipeline becomes more complex

#### Best use

Best if you want version control for writing but do not want the content in this project's history.

---

### Option C: Private object storage or database-stored raw MDX

Store raw MDX in a private system such as object storage, private CMS storage, or database text fields.

#### Pros

- nothing stored in git
- production-friendly if integrated well

#### Cons

- more engineering complexity
- less simple than file authoring
- can reduce the appeal of MDX as a clean writing workflow

#### Best use

Best only if deployment and privacy requirements become stricter later.

---

## Recommended Choice For This Project

Start with **Option A**, then evolve if needed.

### Recommended progression

1. Add support for reading from a private MDX folder
2. Keep that folder git-ignored
3. Merge private MDX + DB posts in the UI
4. Migrate posts one by one
5. If local-only private files become inconvenient, upgrade to a private content repo later

This is the lowest-risk trade-off for the current stage of the project.

---

## Migration Architecture

To make the transition smooth, the app should stop thinking in terms of "DB blogs page" versus "MDX articles page".

Instead, it should move toward a **unified post model**.

### Shared post shape

All content sources should normalize into one interface:

```ts
type UnifiedPost = {
  slug: string
  title: string
  description: string
  publishedOn: string
  locale: "zh" | "en"
  source: "db" | "private-mdx"
  kind: "blog" | "article"
}
```

For detail pages, extend it with:

```ts
type UnifiedPostDetail = UnifiedPost & {
  htmlContent: string
  headings: { text: string; level: number; id: string }[]
}
```

---

## Service Layer Design

Introduce a content abstraction layer so page components do not care where the post came from.

### Suggested service functions

```ts
getAllPosts(locale)
getPostSummaries(locale)
getPostBySlug(slug, locale)
getDbPosts(locale)
getPrivateMdxPosts(locale)
```

### Why this matters

This makes the migration safe because:

- current DB pages can keep working
- new MDX content can plug into the same UI
- future changes happen in one place

---

## Progressive Migration Phases

## Phase 1: Keep the current POC structure

Current state:

- DB blogs still render normally
- one file-backed article POC exists

This is good for proving the concept, but it is still a temporary split experience.

### Goal

Use the current POC as the starting point without replacing the DB system.

---

## Phase 2: Move real MDX files to private storage

Change the source of file-backed articles from tracked repo content to private content.

### Recommended target

Use either:

- `content-private/` inside the repo but git-ignored
- or a private content folder outside the repo entirely

### Result

You still get file-authored articles, but the actual content is no longer tracked in git history.

---

## Phase 3: Merge listing logic

Replace the separate "DB blogs" and "MDX articles" mental split with a unified listing service.

### What to do

- fetch DB posts
- fetch private MDX posts
- normalize both to the same shape
- sort by published date
- render in one list or in one page with filters

### Suggested UI options

#### Option 1: One unified list

- cleanest long-term UX
- readers do not care about the storage model

#### Option 2: One page with source tabs

- useful during transition
- makes migration visible and easier to debug

### Recommendation

Use tabs during the transition, then unify later once the MDX path is stable.

---

## Phase 4: Migrate posts one by one

Start with technical evergreen posts.

### For each migrated post

1. export the DB content
2. create frontmatter and MDX file
3. verify local rendering
4. hide or archive the DB version from public listing
5. keep the DB row only if needed for legacy reasons

### Best candidates first

- technical posts
- articles with code blocks
- portfolio-supporting posts
- stable content unlikely to change often

### Best candidates later

- more personal writing
- experimental posts
- content you are unsure about keeping long-term

---

## Phase 5: Stop creating new long-form posts in DB

Once the private MDX path is stable, stop using the DB as the default authoring path for long-form blog posts.

### New default

- long-form content goes into private MDX
- DB is no longer the main content store for personal articles

### What DB can still be used for

- legacy posts not yet migrated
- future metadata if needed
- optional social features such as likes, comments, tracking, or editor tooling

---

## Phase 6: Decide the final hybrid boundary

At that point you can choose one of two stable end states.

### End State A: Mostly MDX, DB for legacy only

- recommended for this project
- simplest long-term content architecture

### End State B: MDX for canonical content, DB for metadata

Example:

- article body in private MDX
- likes, view count, tags, and lightweight metadata in DB

This is useful if you still want interactive features but do not want the article body in the database.

---

## Deployment Challenge

This is the most important practical issue.

If the real article files are git-ignored, they will not automatically be available in production builds.

So a private-content deployment strategy is required.

### Possible strategies

#### Strategy 1: Sync private folder before build

During deployment:

- copy private article files into the server/build environment
- then run the build

#### Strategy 2: Pull from a private content repo during deployment

During deployment:

- clone or fetch the private content repo
- place it in the expected content directory
- build the app

#### Strategy 3: Fetch from private storage at runtime or build time

The app loads content from a private storage source.

### Recommendation

Start with Strategy 1 if deployment is under your control.

It is the simplest bridge.

---

## Suggested Folder Strategy

### Short-term recommendation

```txt
issue_tracker/
├── app/
├── doc/
├── prisma/
└── content-private/
    ├── zh/
    └── en/
```

And keep:

```txt
app/content/mdx/
```

only for demo or sample content, or remove it later once private content is wired in.

### Stronger privacy recommendation

Move private article files outside the repo entirely:

```txt
/Users/mac/Desktop/code/me_issue_tracker/private-blog-content/
```

This reduces the chance of accidental commit.

---

## Frontmatter Recommendation

Define a stable frontmatter shape early.

### Suggested fields

```md
---
title: "JQuery 基本语法与实践"
description: "一个独立的文件式文章实验。"
publishedOn: "2026-03-31"
locale: "zh"
slug: "jquery-basic-syntax-practice"
tags:
  - "frontend"
  - "jquery"
isPublished: true
---
```

### Why this helps

- easier migration
- more consistent metadata
- simpler rendering logic later

---

## What Should Stay in the Database For Now

Do not force everything out of the DB immediately.

Keep DB support for:

- existing public blog entries
- editing old entries through the UI
- optional likes or lightweight article metadata
- any admin features you still need during transition

This reduces risk and avoids a brittle migration.

---

## What Should Eventually Move to Private MDX

Prioritize moving:

- evergreen technical writing
- personal reflections you want to keep privately authored
- articles with code blocks and custom formatting
- content that benefits from slower, more deliberate editing

These are the best fit for file-authored content.

---

## Risks

### Risk 1: Accidental commit of private article files

#### Mitigation

- use a git-ignored folder
- prefer storing private content outside the repo
- do not test with real personal articles in tracked paths

---

### Risk 2: Deployment breaks because private content is missing

#### Mitigation

- decide private content sync strategy early
- make missing-content failures clear and easy to debug

---

### Risk 3: Dual-source complexity becomes messy

#### Mitigation

- build a unified service layer
- normalize both content sources to the same shape
- avoid branching UI logic everywhere

---

### Risk 4: Partial migration creates confusing UX

#### Mitigation

- keep transition visible with tabs at first
- unify later once enough posts have moved

---

## Recommended Rollout Order

### Step 1

Keep the current DB blog working exactly as is.

### Step 2

Replace tracked MDX sample content with a private-content loading path.

### Step 3

Build a unified post loader that can read from DB and private MDX.

### Step 4

Continue using tabs while validating the private MDX path.

### Step 5

Migrate 1 to 3 technical posts first.

### Step 6

Stop creating new long-form posts in the DB once confidence is high.

### Step 7

Decide whether to keep tabs or merge into one unified article list.

---

## Final Recommendation

For this project, the best trade-off is:

- keep DB support now
- progressively move long-form blog content to **private MDX**
- make private MDX files **git-ignored or stored outside the repo**
- use a **unified content service** so the UI does not care where a post comes from
- stop relying on the DB for new long-form articles once the migration path is stable

This gives you:

- long-term maintainability
- lower content management overhead
- privacy for personal writing
- no risky rewrite
- a realistic migration path that matches how often you actually publish

---

## Suggested Next Implementation Step

The next practical engineering step should be:

### Build private-content loading support

Specifically:

1. choose the private content location
2. make the app read from that location
3. keep it out of git history
4. normalize private MDX and DB content into one interface

That will turn the current POC into a true migration foundation.
