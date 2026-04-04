# Style Normalization Migration Plan

This document defines the step-by-step migration path to fully unify and normalize the website's styling architecture, following the rules and priorities in `AGENTS.md`.

The goal is not a redesign. The goal is to move the site onto one consistent, production-grade styling model with the smallest safe surface area:

- Tailwind CSS for day-to-day styling
- semantic CSS custom properties as the source of truth
- shared UI primitives in `app/components/ui/*`
- shared composed site components for repeated patterns
- CSS Modules only where complexity clearly justifies them

## Success Criteria

The migration is complete when all of the following are true:

- visual styling is primarily expressed through Tailwind utilities and shared primitives
- semantic tokens in `app/globals.css` are the main color, surface, border, typography, radius, and motion source
- old one-off variables such as `--background-color`, `--text-color`, `--card-background-color`, `--chart-link-color`, and similar legacy aliases are removed or fully mapped behind semantic tokens during transition
- shared patterns like buttons, cards, inputs, badges, messages, headings, icon controls, and section shells are reused instead of rebuilt ad hoc
- inline styles are limited to true runtime values only
- CSS Modules remain only for complex editorial or animation-heavy surfaces
- business logic, localization, routing, auth, data flow, and form behavior remain unchanged

## Current State Summary

Based on the current repo:

- `app/globals.css` already contains semantic shadcn-style tokens such as `--background`, `--foreground`, `--card`, `--border`, `--ring`, and `--radius`
- the codebase still uses an older token family via `ThemeService` and direct `var(--*-color)` references
- the shell layer still contains visual inline styles, notably in `app/NavBar.tsx` and `app/[locale]/layout.tsx`
- reusable UI primitives exist in `app/components/ui/*`, but many product components bypass them
- CSS Modules are present in a small set of feature/editorial files and should be reviewed case by case rather than removed wholesale

## Known Drift To Eliminate

These are the main styling drift sources that should be normalized over time:

1. Semantic tokens and legacy tokens coexisting in parallel.
2. Tailwind and ad hoc `var(--legacy-token)` usage mixed in the same component.
3. Repeated one-off card, button, tooltip, and overlay styling outside `app/components/ui/*`.
4. Inline shell styles for nav, backgrounds, and component surfaces.
5. Global utility classes in `app/globals.css` that should either become tokens or reusable components.
6. Duplicate project-card styling in more than one component.

## Files That Define The Migration Backbone

- `app/globals.css`
- `app/service/ThemeService.ts`
- `app/[locale]/layout.tsx`
- `app/NavBar.tsx`
- `app/components/ui/button.tsx`
- `app/components/ui/card.tsx`
- `app/components/ui/input.tsx`
- `app/components/ui/textarea.tsx`

## Step-By-Step Migration

## Phase 0: Freeze Scope And Create A Baseline

Purpose: keep the migration incremental, measurable, and safe.

Actions:

1. Treat this as a styling-only migration unless a visual bug cannot be fixed without a tiny structural change.
2. Do not mix normalization work with Prisma, auth, API, or localization refactors.
3. Create a simple tracking checklist for each migrated area: tokens, primitives, shell, home, projects, contact, blogs, articles, AI playground.
   - Baseline tracker: `doc/normalize/migration-tracker.md`
4. Use before/after screenshots for high-visibility pages in both light and dark mode.
   - Screenshot baseline and storage rules: `doc/normalize/screenshots/README.md`
5. Verify mobile and desktop after each phase, not just at the end.

Verification:

- no route behavior changes
- no copy regressions
- no new visual drift introduced while fixing old drift

Phase 0 implementation status:

- [x] Styling-only migration scope is documented and frozen
- [x] Tracking checklist exists for all planned migration areas
- [x] Screenshot baseline rules and storage path are defined
- [x] Per-phase verification expectations are documented for desktop and mobile

## Phase 1: Normalize The Token System First

Purpose: establish one authoritative styling language before touching many components.

Target files:

- `app/globals.css`
- `app/service/ThemeService.ts`

Actions:

1. Define the semantic token source of truth in `app/globals.css`.
2. Expand tokens only where the repo clearly needs them:
   - surface elevation tokens
   - muted/subtle surface tokens
   - semantic text roles
   - motion timing tokens
   - optional shadow tokens if repeated shadows keep appearing
3. Add temporary compatibility mappings from legacy token names to semantic tokens so migration can be incremental.
4. Stop introducing any new legacy variables.
5. Mark `ThemeService` as a transitional compatibility layer and shrink its responsibility to mapping only.

Recommended compatibility direction:

- `--background-color` -> `--background`
- `--text-color` -> `--foreground`
- `--card-background-color` -> `--card`
- `--border-color` -> `--border`
- `--chart-link-color` -> `--primary`

Exit criteria:

- semantic tokens clearly cover the design system
- legacy tokens are only aliases, not an independent visual system
- new work can use semantic tokens without needing `ThemeService`

## Phase 2: Tighten Global CSS And Tailwind Conventions

Purpose: reduce global drift and push styling decisions toward utilities and tokens.

Target files:

- `app/globals.css`
- Tailwind config files if token extensions are needed

Actions:

1. Keep `app/globals.css` focused on:
   - design tokens
   - base element resets
   - a very small set of global utilities
2. Review existing global utilities such as `.nav-link`, `.nav-control`, `.home-page-heading`, `.wind`, and `.flicker`.
3. Keep only utilities that are truly cross-cutting and stable.
4. Move one-off appearance rules out of globals and into components or primitives.
5. Normalize typography, border radius, focus-ring, and state conventions so product components stop inventing their own versions.

Exit criteria:

- `app/globals.css` reads like a token/base layer, not a catch-all stylesheet
- repeated visual behavior is represented in primitives or composed components

## Phase 3: Strengthen The Primitive Layer

Purpose: make `app/components/ui/*` the default path for shared styling.

Target files:

- `app/components/ui/button.tsx`
- `app/components/ui/card.tsx`
- `app/components/ui/input.tsx`
- `app/components/ui/textarea.tsx`
- new primitives only if duplication is already clear

Actions:

1. Audit all repeated button styles and fold them into button variants.
2. Add shared card variants for common recruiter-facing surfaces:
   - default content card
   - elevated showcase card
   - quiet/secondary card
3. Add shared input and textarea states for focus, validation, disabled, and dark mode.
4. If repeated badge/chip/message patterns exist, create primitives for them before migrating pages.
5. Introduce shared heading or section-shell primitives only when duplication is obvious across multiple areas.

Exit criteria:

- most new shared styling can be expressed with existing primitives
- repeated visual code in feature components starts shrinking instead of growing

## Phase 4: Normalize The App Shell

Purpose: unify the most visible chrome before feature-by-feature migration.

Target files:

- `app/[locale]/layout.tsx`
- `app/NavBar.tsx`
- `app/components/navbar/*`
- `app/context/RadixThemeProvider.tsx` only if styling glue truly belongs there

Actions:

1. Replace shell inline styles with token-driven Tailwind classes wherever possible.
2. Move nav background, blur, border, and state styling away from ad hoc style objects.
3. Standardize nav link, icon-button, and language/theme toggle treatments.
4. Keep provider order unchanged.
5. Remove visual dependence on `xTheme.layoutBackground` once tokens cover the background correctly.

Exit criteria:

- shell appearance is token-driven
- nav interactions and states are visually consistent across desktop and mobile
- provider logic remains separate from styling concerns

## Phase 5: Migrate Home Surface In Order Of Visibility

Purpose: improve the recruiter-facing first impression while staying minimal-change.

Target files:

- `app/[locale]/page.tsx`
- `app/components/Hero.tsx`
- `app/SummaryHeader.tsx`
- `app/PostSummary.tsx`
- `app/Contact.tsx`
- `app/components/AboutMe.tsx`

Actions:

1. Normalize hero typography, spacing rhythm, and token usage without removing its identity or motion.
2. Replace hard-coded accent styling with semantic tokens.
3. Extract repeated section spacing and heading patterns if the home page reveals clear duplication.
4. Bring summary, post preview, and contact surfaces onto the same card/input/message conventions as the primitive layer.
5. Keep the hero distinctive. Do not flatten it into a generic layout.

Exit criteria:

- home feels visually coherent from hero to contact
- no hard-coded colors remain where tokens should be used
- motion still feels intentional and portfolio-quality

## Phase 6: Normalize Projects And Shared Showcase Cards

Purpose: unify a high-credibility portfolio surface and remove repeated custom card logic.

Target files:

- `app/components/ProjectCard.tsx`
- `app/components/ProjectsDetail.tsx`
- `app/components/ProjectTags.tsx`

Actions:

1. Consolidate duplicated project-card styling into one shared implementation path.
2. Replace `var(--card-background-color)`, `var(--border-color)`, and `var(--chart-link-color)` usage with semantic-token-backed classes.
3. Standardize overlay controls, hover states, and tag treatments.
4. If a dedicated showcase-card primitive is justified, create it in `app/components/ui/*` or as a shared site-level composed component.

Exit criteria:

- projects use one visual system
- duplicate hover overlay patterns are eliminated
- recruiter-facing card quality is preserved or improved

## Phase 7: Normalize Blog List And Issue Flows

Purpose: align the densest content/product area without touching business logic.

Target files:

- `app/[locale]/blogs/page.tsx`
- `app/blogs/BlogSectionTabs.tsx`
- `app/blogs/BlogStatusFilter.tsx`
- `app/blogs/BlogTable.tsx`
- `app/blogs/_components/IssueForm.tsx`
- `app/blogs/[id]/*`
- `app/components/IssueStatusBadge.tsx`

Actions:

1. Standardize tables, filters, tabs, form controls, badges, and action buttons.
2. Pull repeated controls onto primitives instead of styling them locally.
3. Preserve readability and technical-content presentation.
4. Review blog detail CSS Modules carefully:
   - keep editorial layout and unusual content presentation if utilities would become awkward
   - migrate simple colors, spacing, borders, and badges back to tokens/utilities where practical
5. Harden form and empty/loading/error visual states while keeping submission behavior unchanged.

Exit criteria:

- blog list/detail/edit/new screens share the same control language
- localized issue flows behave exactly as before
- editorial polish remains intact

## Phase 8: Normalize Articles Without Killing Editorial Character

Purpose: unify tokens while respecting more bespoke article presentation.

Target files:

- `app/[locale]/articles/*`
- `app/articles/_components/*`
- article CSS Modules

Actions:

1. Keep CSS Modules for complex editorial and demonstration-heavy visuals that are genuinely awkward in utilities.
2. Still migrate token references inside those modules toward semantic aliases.
3. Standardize shared article chrome:
   - article shell
   - headings
   - inline callouts
   - code/interactive demo framing
4. Avoid forcing all article visuals into generic cards.

Exit criteria:

- articles feel part of the same site
- article-specific personality still survives
- token usage is consistent even where CSS Modules remain

## Phase 9: Normalize AI Playground And Experimental Surfaces

Purpose: bring experimental UI into the same system without removing its exploratory energy.

Target files:

- `app/[locale]/ai/AIPlayground.tsx`
- related shared components used by chat or tool-like UI

Actions:

1. Audit surfaces, message blocks, controls, code areas, and panel states.
2. Bring the playground onto the same card/input/button/message foundations as the rest of the site.
3. Preserve the experimental feel through composition and motion, not through token drift.
4. Standardize loading, empty, and error states.

Exit criteria:

- the AI area feels intentionally related to the rest of the product
- experimentation reads as a feature, not as a separate visual system

## Phase 10: Review CSS Modules And Remove What No Longer Earns Its Keep

Purpose: finish the migration by making CSS Modules the exception, not the default.

Current CSS Module inventory:

- `app/articles/_components/jquery-article-experience.module.css`
- `app/articles/_components/nextjs-rendering-inline.module.css`
- `app/blogs/[id]/post.module.css`
- `app/blogs/_components/tooltip.module.css`
- `app/components/IIIDButton.module.css`

Actions:

1. Classify each module as:
   - keep as-is because complexity justifies it
   - keep but swap legacy tokens for semantic ones
   - partially migrate simple rules into Tailwind/primitives
   - fully replace if it is no longer providing unique value
2. Avoid deleting a module just to satisfy a rule. Delete it only if the replacement is clearly better and safer.
3. Preserve advanced animation and editorial presentation where it adds real personality.

Exit criteria:

- every remaining CSS Module has a clear technical reason to exist
- no easy shared styling remains stranded in feature-local CSS unnecessarily

## Phase 11: Remove Transitional Styling Debt

Purpose: complete the unification after migrated surfaces are stable.

Target files:

- `app/service/ThemeService.ts`
- `app/globals.css`
- any components still using old token names or shell inline styles

Actions:

1. Remove unused legacy token aliases once usage reaches zero.
2. Delete dead compatibility helpers and obsolete global utilities.
3. Remove duplicate styling branches across shared components.
4. Keep only the final semantic token model and the small approved exceptions.

Exit criteria:

- `ThemeService` is removed or reduced to a minimal non-visual utility if still needed
- no production component depends on old token names
- the final architecture matches `AGENTS.md`

## Suggested Execution Order

Use this order unless a specific task requires a tighter slice:

1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6
8. Phase 7
9. Phase 8
10. Phase 9
11. Phase 10
12. Phase 11

## Verification Checklist Per Phase

After each phase:

1. run targeted checks only for touched files
2. confirm light and dark mode
3. confirm desktop and mobile
4. confirm no locale routing regression
5. confirm no auth, data, or form behavior regression
6. confirm visual consistency improved instead of merely changed

Recommended commands:

```bash
pnpm lint
pnpm test
```

Only run broader verification that is actually supported by the repo and relevant to the touched area. Per project instructions, do not run a production build unless explicitly asked or genuinely required.

## Migration Rules To Keep Repeating

- minimal change always
- preserve recruiter-facing polish
- normalize before reinventing
- do not break business logic
- do not erase personality to gain consistency
- prefer shared primitives over one-off styling
- prefer semantic tokens over hard-coded colors
- prefer Tailwind over scattered custom CSS
- keep CSS Modules only where they are genuinely the best fit

## First Recommended Ticket Breakdown

If this plan is executed through tickets, the safest initial sequence is:

1. Normalize and document semantic tokens in `app/globals.css`.
2. Convert `ThemeService` into a temporary alias-only compatibility layer.
3. Migrate the shell (`app/[locale]/layout.tsx`, `app/NavBar.tsx`, navbar components).
4. Strengthen shared button/card/input patterns.
5. Migrate home hero, summary, and contact.
6. Consolidate project cards and project showcase styling.
7. Normalize blogs/issues.
8. Normalize articles.
9. Normalize AI playground.
10. Remove legacy styling debt.
