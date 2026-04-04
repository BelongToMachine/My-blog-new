# Private MDX Rollout Plan

## Goal

Adopt the private-repo MDX strategy as the long-term direction:

- keep the current database-backed blog alive for now
- progressively move long-form blog content into a separate private content repo
- keep personal article content out of this main website repo history
- eventually make private MDX the default publishing flow for long-form writing

---

## Final Direction

### Main website repo

This repo should keep:

- [ ] application code
- [ ] Prisma schema and database logic
- [ ] rendering logic
- [ ] blog UI and routing
- [ ] content-loading services
- [ ] optional metadata logic

This repo should **not** keep the real long-form article body content.

### Private content repo

The private repo should keep:

- [ ] MDX article files
- [ ] article frontmatter
- [ ] locale-based article organization
- [ ] optional article-only assets

This private repo becomes the canonical home for long-form personal writing.

---

## Frontmatter Standard

Use one stable frontmatter shape from the beginning.

### Required fields

- [ ] `title`
- [ ] `description`
- [ ] `publishedOn`
- [ ] `locale`
- [ ] `slug`
- [ ] `isPublished`

### Optional fields

- [ ] `tags`
- [ ] `coverImage`
- [ ] `updatedOn`
- [ ] `summary`

### Recommended example

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

---

# Phase 1: Prepare the Private Content Repo

## Objective

Create a stable private content repository and define the writing rules before changing the app.

### Phase checklist

- [x] Create the private repo
- [x] Define folder structure
- [x] Define writing rules
- [x] Lock frontmatter format

## Step 1. Create the private repository

- [x] Create a private repo, for example `private-blog-content`
- [x] Add a short README explaining the content format
- [x] Add at least one sample article file

### Deliverable

- [x] A private repo exists and is ready to hold article files

## Step 2. Define folder conventions

### Recommended structure

```txt
private-blog-content/
├── zh/
│   └── jquery-basic-syntax-practice.mdx
├── en/
│   └── ...
└── assets/
```

### Checklist

- [x] Create `zh/`
- [x] Create `en/`
- [x] Create `assets/` if needed
- [x] Use slug-based file names
- [x] Keep one article per file

### Deliverable

- [x] Folder structure is stable and agreed on

## Step 3. Define writing rules

### Rules to enforce

- [x] One article per file
- [x] Frontmatter is required
- [x] File name must match `slug`
- [x] `locale` must always be explicit
- [x] `isPublished` controls visibility
- [x] Start with markdown-compatible content first
- [ ] Delay advanced MDX components until the system is stable

### Deliverable

- [x] Writing workflow is defined and repeatable

---

# Phase 2: Make the Main App Read the Private Repo

## Objective

Teach the main app to load private MDX content without assuming content lives inside the app repo.

### Phase checklist

- [x] Add configurable private content path
- [x] Build private MDX loader
- [x] Define unified content model
- [x] Confirm local loading works

## Step 4. Add a configurable private content path

### Recommended env var

```txt
PRIVATE_BLOG_CONTENT_PATH=/absolute/path/to/private-blog-content
```

### Checklist

- [x] Decide the environment variable name
- [x] Add it to `.env.example` if appropriate
- [x] Make the content service read from it
- [x] Avoid hardcoded local machine paths

### Deliverable

- [x] The app knows where to find the private repo

## Step 5. Build a private MDX loader

### Loader responsibilities

- [x] Read all published posts
- [x] Read one post by slug
- [x] Parse frontmatter
- [x] Parse content
- [x] Filter by locale
- [x] Normalize metadata
- [x] Sort by date

### Deliverable

- [x] A reusable private-content loader exists

## Step 6. Define a unified content model

### Shared model checklist

- [x] Define one shared type for DB and private MDX posts
- [x] Include `source: "db" | "private-mdx"`
- [x] Include shared list metadata
- [x] Include detail-page fields for rendered content and headings

### Example

```ts
type UnifiedPost = {
  slug: string
  title: string
  description: string
  publishedOn: string
  locale: "zh" | "en"
  source: "db" | "private-mdx"
}
```

### Deliverable

- [x] UI can consume one normalized shape regardless of content source

---

# Phase 3: Run a Controlled Hybrid Period

## Objective

Keep both systems alive while validating the new private MDX path.

### Phase checklist

- [x] Keep DB blogs working
- [x] Keep private MDX visible as a parallel source
- [x] Migrate one sample post
- [x] Verify local authoring workflow

## Step 7. Keep DB and private MDX side by side

### Checklist

- [x] Do not remove the current DB blog flow
- [x] Keep separate routing or tabs during transition
- [x] Make source differences visible enough for debugging
- [x] Confirm readers can still access existing DB posts

### Deliverable

- [x] The site safely supports both content systems

## Step 8. Migrate one sample post

### First recommended post

- [x] Use the jQuery article as the first migrated sample

### Migration checklist

- [x] Copy article content into the private repo
- [x] Add valid frontmatter
- [x] Preview locally
- [x] Confirm routing works
- [x] Confirm metadata works
- [ ] Confirm rendering works

### Deliverable

- [ ] One article runs fully from the private repo

## Step 9. Verify the local writing workflow

### Checklist

- [ ] Editing the private repo article updates local preview correctly
- [ ] Frontmatter is easy to maintain
- [ ] Path configuration is stable
- [ ] Locale handling is correct
- [ ] The workflow feels comfortable enough for real writing

### Deliverable

- [ ] The authoring flow is practical, not just technically possible

---

# Phase 4: Start Progressive Migration

## Objective

Move high-value posts one by one without risking the current live blog.

### Phase checklist

- [x] Define migration criteria
- [x] Migrate posts progressively
- [ ] Keep legacy DB policy clear
- [ ] Avoid deleting DB content too early

## Step 10. Define migration order

### Migrate first

- [x] Technical articles
- [x] Evergreen posts
- [x] Articles with code examples
- [x] Posts that strengthen portfolio positioning

### Migrate later

- [ ] Personal reflections
- [ ] Lower-value older content
- [ ] Posts likely to change often

### Deliverable

- [x] A clear migration priority list exists

## Step 11. Migrate posts one by one

### Per-post checklist

- [x] Export content from DB
- [x] Convert it to private MDX
- [x] Validate frontmatter
- [ ] Test rendering
- [ ] Compare old and new versions
- [ ] Mark DB version as archived, hidden, or legacy

### Safety rule

- [ ] Never delete the DB version before the private MDX version is confirmed correct

### Deliverable

- [x] Posts move gradually without breaking the site

## Step 12. Define a legacy policy for DB posts

### Recommended policy

After migration:

- [ ] Keep the DB copy for safety at first
- [ ] Hide it from public listing
- [ ] Mark it as `legacy` or `migrated` if needed

Later:

- [ ] Keep DB rows as archive
- [ ] Or remove article body while preserving lightweight metadata

### Deliverable

- [ ] There is a clear rule for what happens to migrated DB content

---

# Phase 5: Change the Writing Default

## Objective

Once the workflow is stable, make private MDX the default path for new long-form writing.

### Phase checklist

- [ ] Stop using DB for new long-form posts
- [ ] Keep DB only where it still adds value
- [ ] Decide long-term public UI direction

## Step 13. Stop creating new long-form posts in DB

### Trigger condition

- [ ] At least 2 to 5 posts have been migrated successfully
- [ ] Local writing workflow feels stable
- [ ] Private repo path is reliable

### Checklist

- [ ] Make private MDX the default for new long-form writing
- [ ] Stop treating DB as the main writing path
- [ ] Keep DB available for legacy or metadata needs

### DB may still be used for

- [ ] Old posts
- [ ] Optional metadata
- [ ] Interactive features
- [ ] Legacy admin workflows

### Deliverable

- [ ] Private MDX becomes the main publishing flow

## Step 14. Decide public blog UX direction

### Option A

- [ ] Keep tabs between legacy DB content and private MDX content

### Option B

- [ ] Merge both into one unified public blog feed

### Recommended path

- [ ] Keep tabs during transition
- [ ] Move to one unified feed later if the migration succeeds

### Deliverable

- [ ] Final public-facing blog structure is decided

---

# Phase 6: Deployment and Production Readiness

## Objective

Make sure production can access the private content repo safely and reliably.

### Phase checklist

- [ ] Choose private-content deployment strategy
- [ ] Make production able to read private repo content
- [ ] Add failure handling
- [ ] Document the deployment workflow

## Step 15. Decide how production gets private content

### Option A: Clone private repo before build

- [ ] Fetch main app repo
- [ ] Fetch private content repo
- [ ] Place private repo at the expected path
- [ ] Run the build

### Option B: Pull private repo into a subdirectory during deployment

- [ ] Define the automated sync process
- [ ] Confirm path resolution works

### Option C: Mirror private repo content into a secure build directory

- [ ] Configure secure sync
- [ ] Confirm files are available at build/runtime

### Recommended starting point

- [ ] Start with “clone private repo before build”

### Deliverable

- [ ] Production can load private content reliably

## Step 16. Add failure handling

### Checklist

- [ ] Warn clearly if the private content path is missing locally
- [ ] Provide a safe fallback if a private article is missing
- [ ] Add clear logs for build/runtime debugging
- [ ] Make missing private content easy to diagnose

### Deliverable

- [ ] Missing private content does not create silent or confusing failures

---

# Phase 7: Mature the System

## Objective

After the migration is stable, improve metadata, UX, and the final role of the database.

### Phase checklist

- [ ] Add metadata and polish
- [ ] Decide the final DB boundary
- [ ] Keep the system maintainable

## Step 17. Add metadata and polish

Only do this after the basic hybrid pipeline is stable.

### Possible improvements

- [ ] Tags
- [ ] Cover images
- [ ] Reading time
- [ ] Related posts
- [ ] Article series
- [ ] Richer MDX components

### Deliverable

- [ ] The system becomes richer without increasing early migration risk

## Step 18. Decide the final role of the database

### Recommended long-term role

The DB should no longer be the canonical source of long-form article body content.

It may still store:

- [ ] Likes
- [ ] Analytics metadata
- [ ] Lightweight references
- [ ] Admin state
- [ ] Legacy content markers

### Deliverable

- [ ] The long-term system boundary is clear

---

# Milestones

## Milestone 1: Private repo is ready

- [x] Private repo exists
- [x] Folder structure is decided
- [x] Frontmatter format is fixed
- [x] One sample article exists

## Milestone 2: Main app can read private MDX

- [x] App loads articles from the private repo
- [x] Local preview works
- [x] Article detail page renders correctly

## Milestone 3: Hybrid mode is stable

- [x] DB blogs still work
- [x] Private MDX works
- [x] Routing is clear
- [x] Existing readers are unaffected

## Milestone 4: First real posts are migrated

- [x] At least 2 to 5 posts live from private MDX
- [ ] DB versions are marked as legacy or hidden
- [x] The workflow feels usable

## Milestone 5: Private MDX is the default

- [ ] No new long-form posts go into DB by default
- [ ] The private repo is the main content home
- [ ] The app is stable enough for normal publishing

---

# Risks and Controls

## Risk 1: Private repo setup becomes annoying

- [ ] Control: keep folder structure simple
- [ ] Control: use one clear environment variable

## Risk 2: Deployment becomes fragile

- [ ] Control: choose one deployment sync strategy early
- [ ] Control: document it before scaling migration

## Risk 3: Migration drags on forever

- [ ] Control: move only the highest-value posts first
- [ ] Control: do not try to migrate everything immediately

## Risk 4: DB remains the easier habit

- [ ] Control: once proven stable, explicitly make private MDX the default for new long-form writing

---

# Immediate Next Steps

- [x] Create the private content repository
- [x] Define the folder structure and frontmatter rules
- [x] Add a configurable private content path to the app
- [x] Refactor the content loader to read from the private repo
- [x] Move the current jQuery POC article into the private repo
- [x] Verify local preview and routing
- [x] Start migrating 1 to 3 evergreen technical posts
