# Dark Mode Completion Plan

## Goal

Finish the dark mode toggle so it works consistently across:

- Tailwind `dark:` styles
- Radix UI theme components
- Existing custom CSS variable consumers
- Desktop and mobile navigation
- Initial page load without visual mismatch

This plan is based on the current implementation in:

- [app/context/DarkModeContext.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/context/DarkModeContext.tsx)
- [app/[locale]/layout.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/[locale]/layout.tsx)
- [app/layout.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/layout.tsx)
- [app/globals.css](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/globals.css)
- [public/index.js](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/public/index.js)
- [app/components/navbar/DesktopNav.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/components/navbar/DesktopNav.tsx)
- [app/components/navbar/MobileNav.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/components/navbar/MobileNav.tsx)

## Current Problems

### 1. Radix theme is permanently light

`@radix-ui/themes` is wrapped with `appearance="light"` in the locale layout, so the dark mode toggle cannot affect Radix surfaces, buttons, menus, or tokens.

Impact:

- Radix components remain visually light even when the app state says dark
- Custom-styled and Radix-styled UI can disagree on the same screen

### 2. Tailwind dark mode is configured but not activated

The project uses `darkMode: ["class"]`, and `globals.css` defines a `.dark` token block, but the root element never receives the `dark` class.

Impact:

- `dark:` utilities do not work
- parts of the codebase look prepared for dark mode but never actually switch

### 3. Three separate theme systems are running in parallel

The current implementation mixes:

- custom inline CSS variables from `public/index.js`
- Tailwind semantic tokens in `globals.css`
- Radix `appearance`

Impact:

- theme changes are incomplete
- different UI layers can drift apart
- dark mode bugs are harder to reason about and fix

### 4. Theme toggle is desktop-only

Desktop nav exposes the toggle, but mobile nav does not.

Impact:

- dark mode is incomplete on mobile
- the feature is inconsistent across breakpoints

### 5. Initial theme state is fragile

The provider defaults to `"dark"` and corrects itself after mount by reading `--initial-color-mode` from the root.

Impact:

- toggle icon and client state can briefly disagree with the rendered page
- hydration behavior is harder to trust

## Recommended Architecture

Use a single source of truth for the active theme:

- Root HTML state controls the active theme
- Tailwind dark mode follows the root `dark` class
- Radix `appearance` follows the same resolved theme
- Legacy CSS variable consumers continue to work, but are fed from the same root state

Recommended root contract:

- `document.documentElement.classList.contains("dark")` determines dark mode
- `document.documentElement.style.colorScheme` is set to `light` or `dark`
- `localStorage["color-mode"]` stores the user preference
- optional support for `system` can be added now to avoid another refactor later

## Implementation Plan

### Phase 1. Fix the theme bootstrap

Update [public/index.js](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/public/index.js) so it does all theme initialization before hydration:

- Resolve initial mode from `localStorage`
- Fall back to `prefers-color-scheme`
- Apply `html.dark` when dark is active
- Set `color-scheme` on the root
- Continue applying the legacy CSS custom properties required by `xTheme`

Result:

- first paint matches the resolved theme
- Tailwind dark variants become functional
- custom CSS variable consumers still render correctly

### Phase 2. Refactor the theme provider into a coordinator

Update [app/context/DarkModeContext.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/context/DarkModeContext.tsx) so `setColorMode` updates all theme layers together:

- React state
- `localStorage`
- root `.dark` class
- root `color-scheme`
- legacy CSS variables

Also remove the fragile `"dark"` default-plus-correction approach. The provider should initialize from the already-applied DOM state or the same resolution logic used by the bootstrap script.

Result:

- toggle state and rendered theme stay in sync
- there is one code path for theme changes

### Phase 3. Make Radix follow the same theme

Replace the static Radix wrapper in [app/[locale]/layout.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/[locale]/layout.tsx) with a client-side wrapper component that reads the shared theme state and passes:

- `appearance="light"` when the resolved mode is light
- `appearance="dark"` when the resolved mode is dark

Keep accent and radius settings unchanged unless there is a design reason to revise them.

Result:

- Radix surfaces and controls switch correctly
- custom and Radix components stop fighting each other visually

### Phase 4. Finish the toggle UX on all breakpoints

Keep the existing desktop toggle in [app/components/navbar/DesktopNav.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/components/navbar/DesktopNav.tsx), but make sure it relies on the unified theme logic.

Add the same capability to [app/components/navbar/MobileNav.tsx](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/components/navbar/MobileNav.tsx):

- either as a dedicated toggle button in the mobile bar
- or as a clear menu item in the dropdown

Recommendation:

Use a visible mobile toggle instead of burying it deep in the menu. Theme switching is a global preference and should be easy to discover.

### Phase 5. Consolidate tokens without breaking existing code

The project already has legacy theme variables consumed through `xTheme` in [app/service/ThemeService.ts](/Users/mac/Desktop/code/me_issue_tracker/issue_tracker/app/service/ThemeService.ts).

Do not remove this immediately. Instead:

- keep `xTheme` temporarily as a compatibility layer
- ensure its values come from the same active theme state
- gradually migrate components toward semantic Tailwind and Radix tokens where practical

Result:

- less risk during rollout
- a cleaner migration path instead of a full rewrite

### Phase 6. Audit and clean component-level dark mode usage

After the plumbing is fixed, review components for:

- dormant `dark:` utilities that now become active
- hard-coded light-only colors
- inline styles that should become semantic tokens
- Radix components that assume a light surface

Priority targets:

- navigation
- chatbot surfaces and code blocks
- hero section
- blog cards/tables
- contact and project components using Radix primitives

### Phase 7. Add lightweight verification

This repo does not currently have dark mode regression coverage, so add at least lightweight checks for:

- persisted preference survives refresh
- first paint respects saved preference
- system preference fallback works
- Radix appearance changes with the toggle
- desktop and mobile controls both update the same state

If automated coverage is postponed, a manual QA checklist should still be documented and executed before considering the work complete.

## Suggested Execution Order

1. Fix `public/index.js`
2. Refactor `DarkModeContext`
3. Add a client Radix theme bridge
4. Connect desktop and mobile toggles
5. Test first-paint and persistence behavior
6. Sweep components for visual inconsistencies

This order matters because visual cleanup should happen only after the theme plumbing is reliable.

## Scope Boundaries

This plan is specifically for completing the dark mode toggle and theme synchronization.

It does not require:

- a full redesign of the color palette
- replacing all inline styles immediately
- removing the legacy theme variable system in one pass
- a production build during implementation unless explicitly needed

## Definition of Done

Dark mode can be considered finished when all of the following are true:

- theme preference is resolved correctly before hydration
- toggling updates Tailwind, Radix, and legacy CSS variable consumers together
- desktop and mobile both expose the same theme control
- the current page does not visually mix light and dark surfaces after switching
- refreshing the page preserves the chosen theme
- the app respects system preference when no explicit choice has been saved

## Recommended Follow-Up

After the toggle is complete, a second pass should simplify the theming model by reducing dependence on custom inline theme variables and moving more UI onto shared semantic tokens. That is a cleanup phase, not a prerequisite for getting the toggle finished correctly.
