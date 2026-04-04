# Private MDX Local Setup

## Goal

Connect this website repo to the private blog content repo:

- main app repo: `issue_tracker`
- private content repo: `Private-Blog-Content`

Private repo URL:

```txt
https://github.com/BelongToMachine/Private-Blog-Content
```

---

## Recommended Local Folder Layout

Keep the two repos side by side.

```txt
/Users/mac/Desktop/code/me_issue_tracker/
├── issue_tracker/
└── Private-Blog-Content/
```

This is the cleanest layout for local development because the app repo stays separate from the private content repo.

---

## Step 1. Clone the Private Repo Locally

Clone your private content repo next to the website repo.

Example:

```bash
cd /Users/mac/Desktop/code/me_issue_tracker
git clone git@github.com:BelongToMachine/Private-Blog-Content.git
```

If you use HTTPS:

```bash
cd /Users/mac/Desktop/code/me_issue_tracker
git clone https://github.com/BelongToMachine/Private-Blog-Content.git
```

---

## Step 2. Confirm the Folder Structure

The private repo should follow this structure:

```txt
Private-Blog-Content/
├── zh/
│   └── jquery-basic-syntax-practice.mdx
├── en/
│   └── ...
└── assets/
```

Checklist:

- [ ] `zh/` exists
- [ ] `en/` exists
- [ ] `assets/` exists if needed
- [ ] file names use slugs
- [ ] each article is one `.mdx` file

---

## Step 3. Add the Environment Variable

In your local `.env`, add:

```txt
PRIVATE_BLOG_CONTENT_PATH="/Users/mac/Desktop/code/me_issue_tracker/Private-Blog-Content"
```

The app now prefers this path automatically.

If the path is missing or invalid, the app falls back to the tracked sample article folder and logs a warning.

---

## Step 4. Move the jQuery Article Into the Private Repo

Copy the current POC article into:

```txt
Private-Blog-Content/zh/jquery-basic-syntax-practice.mdx
```

Recommended frontmatter:

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

Checklist:

- [ ] article file exists in `zh/`
- [ ] file name matches slug
- [ ] `locale` is set to `zh`
- [ ] `isPublished` is `true`

---

## Step 5. Verify the App Locally

After setting the env var and copying the article:

- [ ] start the dev server
- [ ] open `/zh/articles`
- [ ] open `/zh/articles/jquery-basic-syntax-practice`
- [ ] confirm article list renders
- [ ] confirm detail page renders
- [ ] confirm headings / TOC still work

---

## Notes

- The current app supports both the private repo structure and the tracked fallback folder
- The private repo is now the preferred source of truth for MDX article loading
- The fallback content should only be treated as a temporary local/dev bridge

---

## Recommended Next Step After Local Verification

Once the private repo works locally:

- migrate the jQuery article fully into the private repo
- treat the private repo as the canonical source
- begin migrating 1 to 3 evergreen technical posts next
