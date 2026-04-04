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

## Verification Checklist

- [ ] The component still works in light mode
- [ ] The component still works in dark mode
- [ ] The component still works on mobile
- [ ] No business logic changed
- [ ] No new hard-coded colors were added
- [ ] The new pattern reuses existing primitives where possible
