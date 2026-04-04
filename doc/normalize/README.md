# Style Normalization Master Plan And Guide

This is the single source of truth for styling normalization work in this repo.

Use this document for:

- normalization scope and guardrails
- current product direction
- execution workflow
- completed vs pending checklist items
- migration phases
- verification expectations
- screenshot baseline rules

`AGENTS.md` remains the higher-priority project memory and rule source. This file consolidates the practical normalization plan and working guide under `doc/normalize/`.

---

## Product Direction

This is a production-facing portfolio, blog, and AI showcase site.

Normalization goals:

- converge on one maintainable styling architecture
- preserve the current recruiter-facing look unless the user explicitly asks for visual revision
- keep migrations incremental and easy to verify
- improve consistency without flattening page personality

Current product-direction decisions:

- `Projects` is no longer an active product module
- `Contact` form is no longer an active product module
- future normalization work should focus on:
  - navigation and shared shell
  - home shared rhythm
  - blogs and articles
  - AI playground

---

## Architecture Direction

Target styling model:

- Tailwind CSS for day-to-day styling
- semantic CSS custom properties as the token source of truth
- shared primitives in `app/components/ui/*`
- shared site-level composed components where repetition is clear
- CSS Modules only for complex editorial or animation-heavy surfaces

Preferred component layering:

- `app/components/ui/*`
  - reusable primitives
- `app/components/system/*`
  - site-level shared composed components
- `app/components/features/*`
  - feature-specific compositions

Keep as exceptions, not defaults:

- inline styles only for true runtime values
- CSS Modules only when utilities/components are awkward or overly complex

---

## Current Observations

Main styling drift currently comes from:

1. Semantic tokens and legacy token names coexisting in parallel.
2. Tailwind classes and `var(--legacy-token)` usage mixed in the same surfaces.
3. Repeated one-off styles for headings, nav controls, overlays, messages, and panels.
4. Inline shell styles in visible shared chrome.
5. Global utilities in `app/globals.css` carrying too much visual responsibility.
6. Older normalization notes that still referenced removed `project` and `contact` surfaces.

Relevant backbone files:

- `app/globals.css`
- `app/service/ThemeService.ts`
- `app/[locale]/layout.tsx`
- `app/NavBar.tsx`
- `app/components/ui/button.tsx`
- `app/components/ui/card.tsx`
- `app/components/ui/input.tsx`
- `app/components/ui/textarea.tsx`

---

## Working Rules

### Execution Rules

- [x] Keep changes minimal.
- [x] Do not change business logic as part of normalization.
- [x] Confirm scope before editing.
- [ ] Verify dark mode, mobile, and interaction states after each completed batch.
- [x] Do not mix normalize work with unrelated feature work.

### Skill Workflow

- [x] Use `normalize` when aligning tokens, spacing, variants, or component patterns.
- [x] Use `frontend-design` when design context or direction needs to be clarified.
- [ ] Use `extract` when repeated patterns should become shared components.
- [ ] Use `adapt` when responsive behavior becomes part of the task.
- [ ] Use `harden` when edge states, overflow, or fragile UI states are involved.
- [ ] Use `polish` after substantial UI work is complete.

### Per-Task Workflow

- [x] Identify which phase the task belongs to.
- [x] Limit the touched pages/components for that batch.
- [x] Compare against the normalization rules before editing.
- [x] Do the minimum necessary verification after the change.
- [ ] Only move to the next checklist item after the current one is genuinely complete.

### Coding Guidance

- [x] Do not introduce new legacy token names such as `--text-color` or `--border-color`.
- [x] Prefer tokens over hard-coded colors.
- [ ] Prefer `app/components/ui/*` first for new shared UI.
- [ ] Prefer `app/components/system/*` for repeated site-level patterns.
- [ ] Prefer `app/components/features/*` for feature-local compositions.
- [ ] Avoid new raw inline style usage unless runtime values require it.
- [ ] Avoid growing the visual responsibility of `@radix-ui/themes`.
- [ ] Reuse variants before inventing new one-off class combinations.
- [ ] Keep feature-local components local unless reuse is clear.

---

## Progress Tracker

### Area Status

- [x] Tokens
- [x] Primitives
- [x] Shell
- [x] Home
- [ ] Blogs
- [ ] Articles
- [ ] AI playground
- [x] Deprecated `Projects` cleanup
- [x] Deprecated `Contact` cleanup

### Verification Checklist Per Batch

- [ ] No route behavior changes
- [ ] No copy regressions
- [ ] No business-logic changes
- [ ] No new visual drift introduced
- [ ] Light mode checked
- [ ] Dark mode checked
- [ ] Desktop checked
- [ ] Mobile checked

### Notes

- [x] Phase 0 baseline was created.
- [x] Phase 1 token foundation was normalized in `app/globals.css`.
- [x] `ThemeService` was reduced to a semantic-token compatibility layer.
- [x] `ActionIconButton` and `SectionHeading` were introduced as the first shared system components.
- [x] Navbar shell styling was moved from inline styles toward token-backed Tailwind classes.
- [x] `SummaryHeader` was migrated from the global `.home-page-heading` utility to `SectionHeading`.
- [x] Legacy project assets and related plan references were removed.
- [x] Contact was removed from the forward-looking normalization roadmap.
- [x] Verification completed for phase 1 token work: `pnpm lint`
- [x] Verification completed for the navbar/shared-component batch: `pnpm lint`

---

## Phase Plan

## Phase 0: Freeze Scope And Baseline

Purpose:

- keep migration incremental, measurable, and safe

Checklist:

- [x] Treat normalization as styling-only unless a tiny structural change is necessary.
- [x] Keep auth, Prisma, API, routing, and localization refactors out of normalize work.
- [x] Establish a persistent tracking checklist.
- [x] Establish screenshot baseline rules.
- [x] Establish per-phase desktop/mobile verification expectations.

Done definition:

- [x] Scope is frozen.
- [x] Tracking exists.
- [x] Screenshot conventions exist.
- [x] Verification expectations are documented.

## Phase 1: Normalize Tokens First

Purpose:

- establish one authoritative styling language before broader component migration

Checklist:

- [x] Inventory current token sources.
- [x] List semantic tokens already in `app/globals.css`.
- [x] Inventory legacy variables such as:
  - `--text-color`
  - `--border-color`
  - `--card-background-color`
  - `--background-color`
  - `--chart-link-color`
- [x] Define the old-to-new token mapping direction.
- [x] Mark which legacy tokens remain as temporary aliases.
- [x] Identify high-risk hard-coded-color areas for later cleanup.
- [x] Freeze semantic token categories:
  - surface
  - text
  - brand
  - feedback
  - structure
  - shape
- [x] Confirm `app/globals.css` semantic tokens as the primary system.
- [x] Map `--chart-link-color` to the semantic brand direction.
- [ ] Decide whether `success` and `warning` tokens should be added now.
- [x] Review `tailwind.config.js`.
- [x] Add high-value missing foundation tokens:
  - shadow
  - motion duration
  - typography roles placeholder coverage
- [ ] Decide how much of `colors.blue` and `colors.green` should remain exposed to business code.
- [ ] Define allowed brand shades if full palettes remain exposed.
- [ ] Audit whether `app/globals.css` utilities are still carrying too much component styling.

Done definition:

- [x] Semantic tokens cover the current system direction.
- [x] Legacy tokens are aliases rather than a parallel system.
- [x] New work can target semantic tokens directly.
- [ ] The styling rules doc exists and clearly defines where new styling should live.

## Phase 2: Tighten Global CSS And Tailwind Conventions

Purpose:

- reduce global drift and move styling decisions into tokens, utilities, and primitives

Checklist:

- [ ] Keep `app/globals.css` focused on tokens, resets, and a small set of stable utilities.
- [ ] Review utilities such as:
  - `.nav-link`
  - `.nav-control`
  - `.home-page-heading`
  - `.wind`
  - `.flicker`
- [ ] Keep only cross-cutting global utilities.
- [ ] Move one-off appearance rules into components or primitives.
- [ ] Normalize typography, radius, focus-ring, and common state conventions.

Done definition:

- [ ] `app/globals.css` reads like a token/base layer rather than a catch-all stylesheet.
- [ ] Repeated visual behavior has an obvious home in primitives or shared components.

## Phase 3: Establish The Primitive And System Layers

Purpose:

- make shared styling flow through primitives and site-level components instead of one-off page code

Checklist:

- [ ] Confirm `app/components/ui/*` as the primitive layer.
- [ ] Confirm or create `app/components/system/*`.
- [ ] Confirm or create `app/components/features/*`.
- [ ] Document directory responsibilities.
- [ ] Audit current primitive coverage for:
  - `button`
  - `input`
  - `textarea`
  - `card`
- [ ] Define missing primitive candidates if duplication is clear.
- [ ] Extract initial shared system components:
  - [x] `SectionHeading`
  - [ ] `SurfaceCard`
  - [x] `ActionIconButton`
  - `StatusMessage`
  - `FormMessage`
  - optional `PageContainer`
  - optional `Section`
  - optional `SectionIntro`
- [ ] Define shared variant rules for button, card, input, textarea, and shared message states.

Done definition:

- [ ] A first batch of reusable system components exists.
- [ ] Shared pages stop inventing one-off heading/card/message treatments.
- [ ] Primitive vs system responsibilities are clear.

## Phase 4: Shared Shell Pilot

Purpose:

- use the navigation and home shared shell as the first meaningful pilot

Checklist:

- [x] Normalize navigation and home shared shell styling.
- [ ] Keep shared shell components visual/interaction-focused without adding business logic.
- [x] Route common icon actions through a shared icon-button treatment.
- [ ] Unify shared section title, description, and auxiliary-action language.
- [ ] Unify hover, focus, and overlay treatment where repetition exists.
- [x] Clean old token usage out of the shared shell path.
- [ ] Validate desktop/mobile and dark mode after the pilot.
- [ ] Feed the pilot learnings back into this guide.

Done definition:

- [ ] Shared shell patterns become reusable references for later pages.
- [ ] The pilot improves consistency without changing the site’s current look.

## Phase 5: Normalize High-Impact Shared Areas

Purpose:

- improve the most visible retained surfaces before deeper content pages

Priority order:

1. navigation
2. home shared sections
3. shared content-section rhythm

Checklist:

- [x] Unify `NavBar.tsx`
- [x] Unify `DesktopNav.tsx`
- [x] Unify `MobileNav.tsx`
- [ ] Establish one visual language for nav items and nav controls.
- [x] Reduce inline style and old-token dependence in the shell.
- [ ] Review home section spacing rhythm.
- [ ] Introduce shared `Section` or `PageContainer` only if duplication is clear.
- [x] Replace scattered heading treatments with the shared heading model where safe.
- [ ] Preserve Hero personality.

Done definition:

- [ ] The most visible shared surfaces feel aligned.
- [ ] Navigation and home shell use one interaction language.

## Phase 6: Normalize Content-Heavy Pages

Purpose:

- bring blogs and articles into the same system while protecting readability and editorial character

Checklist:

- [ ] Normalize blog list heading and filter/action entry styling.
- [ ] Normalize blog list surface language across table/card/list patterns.
- [ ] Audit blog detail special styling and identify which CSS Modules must remain.
- [ ] Systematize shared blog detail parts where safe:
  - heading
  - metadata
  - panels
  - actions
  - feedback areas
- [ ] Keep markdown, code block, and reading quality intact.
- [ ] Audit article enhancement components against the system.
- [ ] Preserve editorial personality while aligning spacing, surface, and hierarchy.

Done definition:

- [ ] Blogs and articles feel like part of the same product as home and shell.
- [ ] Editorial character remains intact.

## Phase 7: Normalize AI Playground And Experimental Surfaces

Purpose:

- bring the experimental UI back under the shared system after the foundation is mature

Checklist:

- [ ] Unify AI playground input area styling.
- [ ] Unify message/panel surfaces outside specialized code rendering.
- [ ] Unify prompt, error, and status feedback treatment.
- [ ] Unify toolbar, upload, and supporting interaction surfaces.
- [ ] Keep the AI playground’s experimental feel while aligning tokens and surface language.
- [ ] Review examples/use-case pages and decide whether to normalize, downgrade, or delete them.

Done definition:

- [ ] Experimental pages no longer feel visually detached from the rest of the product.

## Phase 8: Cleanup And Deletion

Purpose:

- remove drift sources and keep future work on one system

Checklist:

- [x] Remove deprecated project assets and helper files.
- [x] Remove contact from the active normalization roadmap.
- [ ] Delete legacy token paths once no longer needed.
- [ ] Delete obsolete duplicate visual implementations replaced by shared components.
- [ ] Add recommended and forbidden patterns to the final rules doc.
- [ ] Refresh `app/design-system/page.tsx` so it reflects real in-use components.

Done definition:

- [ ] Removed paths no longer influence future styling work.
- [ ] Design-system guidance reflects real current usage.

---

## Screenshot Baseline

Use `doc/normalize/screenshots/` for visual baselines when a phase touches visible UI.

Capture rules:

- [x] capture light mode and dark mode
- [x] capture desktop and mobile
- [x] capture before and after a visible phase
- [x] prioritize high-visibility pages first

Recommended coverage for future phases:

- shell / navigation
- home
- blogs list and detail
- articles list and detail
- AI playground

Filename format:

- `<area>-<viewport>-<theme>-<state>.png`

Examples:

- `home-desktop-light-before.png`
- `home-desktop-light-after.png`
- `shell-mobile-dark-before.png`

---

## Verification Notes

Run only the verification that matches the actual touched area.

Completed verification so far:

- [x] `pnpm lint` for the token-foundation work

Pending as later UI phases begin:

- [ ] visual before/after screenshots
- [ ] desktop manual QA
- [ ] mobile manual QA
- [ ] dark-mode QA for touched screens
- [ ] interaction-state QA for touched screens
