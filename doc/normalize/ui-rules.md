# UI Rules For Normalization

This doc is the working contract for styling normalization.

## Source Of Truth

- Tailwind for layout, spacing, typography, and responsive behavior
- CSS variables in `app/globals.css` for semantic tokens
- `app/components/ui/*` for reusable primitives
- `app/components/system/*` for site-level shared patterns
- CSS Modules only for complex local exceptions

## Decision Order

When a new UI pattern appears, use this order:

1. reuse an existing `ui` primitive
2. extend the primitive with a variant
3. extract or reuse a `system` component
4. keep it feature-local if the pattern is domain-specific
5. use CSS Modules only if the pattern is too complex for utilities

## Allowed Defaults

- Use token-based classes like `bg-card`, `text-foreground`, `border-border`
- Use Tailwind utilities for spacing, layout, and responsive rules
- Use variants for repeated button, card, message, and control states
- Use inline style only for runtime values that cannot be expressed with classes

## Escalation Rules

- If a visual pattern appears in 2 or more places, prefer a shared variant or `system` component
- If a component needs custom surface, heading, or message treatment, check `app/components/system/*` before inventing a new pattern
- If a style change would affect nav, cards, form states, or section rhythm, update the shared layer first

## Styling Path By Type

- Tailwind directly: layout, spacing, typography scale, responsive behavior, token-based color classes
- `ui` variants: button, input, textarea, repeated state treatment
- `system` components: section heading, surface card, action icon button, form/status message, page section rhythm
- CSS Modules: complex editorial modules, unusual animations, hard-to-express composited visuals

## Use Variant Instead Of Raw Classes

These patterns should not be re-invented inside feature components:

- button emphasis, icon buttons, and CTA hierarchy
- input and textarea validation states
- card and surface shells
- inline helper, warning, success, and error messages
- repeated section headings and section intros

Preferred order:

1. use an existing `ui` primitive
2. add or reuse a primitive variant
3. use an existing `system` component
4. extract a shared `system` pattern only if duplication is real
5. keep it feature-local only when the pattern is truly one-off

## Inline Style Rules

Inline style is allowed only when at least one of these is true:

- the value is runtime-only and cannot be expressed with classes
- the value is a generated image or background URL
- the target API requires a `style` object

Inline style is not an excuse to bypass tokens. If a value is stable, move it to tokens, variants, utilities, or a shared component.

## Avoid

- New hard-coded colors when a token exists
- Mixed token naming in the same component
- New one-off heading, card, or button patterns inside business components
- Expanding global CSS selectors for local component concerns

## Token Naming

Prefer semantic tokens:

- surface: `--background`, `--card`, `--popover`
- text: `--foreground`, `--muted-foreground`
- brand: `--primary`, `--secondary`, `--accent`
- feedback: `--destructive`
- structure: `--border`, `--input`, `--ring`
- shape: `--radius`

If a legacy token still exists, map it first and remove it only after the replacement is proven.

## Legacy Token Mapping

Current migration mapping:

- `--text-color` -> `--foreground`
- `--border-color` -> `--border`
- `--card-background-color` -> `--card`
- `--background-color` -> `--background`
- `--chart-link-color` -> `--primary`
- `--button-hover-color` -> `--accent`
- `--scrollable-background-color` -> derived surface token kept temporarily as a compatibility alias

Legacy aliases may stay temporarily in `app/globals.css` and `public/index.js`, but new code should prefer the semantic token directly.

## Tailwind Palette Rule

- `primary` and `secondary` are semantic tokens, not full raw color scales
- do not depend on `primary-400`, `primary-600`, `secondary-500`, or similar scale classes in new code
- if a screen still depends on those classes, migrate it to semantic token usage before adding more

## Recommended And Avoided Examples

Recommended:

- `bg-card text-card-foreground border-border`
- `<Button variant="subtle" />`
- `<Input state="error" />`
- `<SurfaceCard />`
- `<SectionHeading />`

Avoid:

- `bg-[var(--card-background-color)]` in new components
- `text-yellow-500`, `bg-blue-500`, `border-gray-300` when semantic tokens already cover the need
- one-off heading styles inside feature components
- mixing semantic token classes and legacy token variables in the same new component

## Verification Checklist

- [ ] The component still works in light mode
- [ ] The component still works in dark mode
- [ ] The component still works on mobile
- [ ] No business logic changed
- [ ] No new hard-coded colors were added
- [ ] The new pattern reuses existing primitives where possible
