# Styling Strategy Analysis — jie-blog

## 🔍 Current State Audit

After reviewing your codebase, here is what you're currently using **all at once**:

| Method | Where it's used | Example |
|---|---|---|
| **Tailwind CSS utility classes** | Almost everywhere | `Hero.tsx`, `ProjectCard.tsx`, `Contact.tsx` |
| **styled-components** | `packages/Screen.tsx` (MacOS code block taskbar / dots) | `styled.div`, `styled.div<{colorMode}>` |
| **CSS Modules** | `components/IIIDButton.module.css` | `.pushable`, `.front`, `.edge` |
| **Radix UI themes** | `Contact.tsx`, `ProjectsDetail.tsx`, `NavBar.tsx` | `<Card>`, `<Box>`, `<Text>` |
| **shadcn/ui (CVA pattern)** | `components/ui/button.tsx`, `card.tsx`, etc. | `cva()` + Tailwind classes |
| **CSS custom properties (tokens)** | `globals.css` | `--background`, `--primary`, `--radius` |
| **Raw global CSS** | `globals.css` | `.wind`, `.flicker`, `ul li` |

> [!WARNING]
> This is **4+ styling systems** running simultaneously. It's not just messy — it creates real problems: conflicting dark mode logic, inconsistent spacing/color usage, heavier bundle size, and more mental overhead when you extend the site.

---

## 🧭 Option A — Standardize on Tailwind CSS + CSS Custom Properties (Recommended ✅)

### What it means
- Keep Tailwind as the **only** styling system for layout, spacing, typography, and colors
- Keep your existing **CSS custom properties** in `globals.css` as your design tokens (you already started this with `--background`, `--primary`, etc.)
- Replace `styled-components` with Tailwind + inline styles when a dynamic prop is needed
- Keep `CSS Modules` only for the most complex one-off animations (like `IIIDButton.module.css`) where raw CSS wins
- Fully remove `styled-components` from the bundle

### Pros ✅
- **You already have 80% of the work done** — your `globals.css`, `tailwind.config.js`, and `shadcn/ui` components already follow this pattern perfectly
- **Smaller bundle** — `styled-components` is ~12kb gzipped and brings runtime overhead; Tailwind is zero runtime
- **Dark mode is natural** — your existing `dark:` variant + CSS var approach already works
- **Better Next.js App Router compatibility** — `styled-components` needs extra config for RSC (React Server Components); Tailwind does not
- **shadcn/ui, Radix UI, CVA all play nicely together** under this model
- **High consistency** — one mental model for your whole team (or future self)
- **IDE autocomplete** is excellent with Tailwind IntelliSense

### Cons ❌
- **Inline logic for dynamic styles** is slightly verbose: you need `clsx` or `cn()` to conditionally apply classes — you already have both imported (`clsx`, `cn`, `tailwind-merge`)
- **Long className strings** — deep composition can get ugly, but CVA (which you already use in `button.tsx`) solves this elegantly
- **No scoped styles by default** — but CSS Modules fill this gap for the rare special component

---

## 🧭 Option B — Standardize on styled-components

### What it means
- Migrate all Tailwind utility usage to styled-components
- Use `ThemeProvider` for design tokens instead of CSS variables

### Pros ✅
- True CSS-in-JS: styles are colocated with components, no class name collisions
- Dynamic props are very natural (you already see this in `MacOSTaskbar`)
- TypeScript support for props is great

### Cons ❌
- **Heavy runtime cost** — styles are generated in JS at runtime; bad for performance and Core Web Vitals
- **Poor App Router / RSC support in Next.js 14+** — Server Components cannot use styled-components, so every component using it must be `"use client"`. This goes against Next.js's architecture direction.
- **Conflicts with shadcn/ui** — shadcn/ui components are Tailwind-based; you'd need to rewrite them all
- **Bigger learning gap** — you'd have to undo most of your existing Tailwind/CSS-var setup
- **Not the direction the ecosystem is headed** in the Next.js/React Server Component era

> [!CAUTION]
> I **do not recommend** expanding styled-components usage. Its runtime model is increasingly at odds with Next.js App Router's RSC architecture.

---

## 🧭 Option C — CSS Modules Only (No framework)

### What it means
- Replace everything with `.module.css` files per component

### Pros ✅
- Zero runtime, native browser CSS, maximum control
- Perfect scoping, no class name conflicts
- Works with RSC perfectly

### Cons ❌
- **Much more verbose** — you lose Tailwind's utility layer and have to hand-write every layout rule
- No built-in design token enforcement — you can forget to use `var(--primary)` and hard-code a color by accident
- You'd have to migrate all shadcn/ui components
- Loses the great developer ergonomics you already have

---

## 🎯 My Recommendation: **Option A — Tailwind + CSS Custom Properties**

You are **already 80% there**. Here's the concrete action plan:

### Step 1: Remove styled-components

The only real usage is `packages/Screen.tsx`. Replace it like this:

```tsx
// Before (styled-components)
const MacOSTaskbar = styled.div<{ colorMode: string }>`
  background: ${(props) => props.colorMode === "dark" ? "#2d2d2d" : "#f0f0f0"};
`

// After (Tailwind + inline style for the one dynamic value)
<div
  className="flex items-center h-6 px-3 py-2"
  style={{ background: colorMode === "dark" ? "#2d2d2d" : "#f0f0f0" }}
>
```

### Step 2: Define your CSS Design Tokens properly

You already started in `globals.css`. Here's the full token structure I'd recommend adding:

```css
@layer base {
  :root {
    /* Colors */
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
    --primary: 200 100% 31%;
    --primary-foreground: 0 0% 100%;
    --secondary: 200 88% 88%;
    --muted: 0 0% 95%;
    --muted-foreground: 215 16% 47%;
    --accent: 200 88% 88%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --ring: 200 100% 31%;

    /* Typography */
    --font-sans: 'Inter', sans-serif;
    --font-display: 'flickering', cursive;

    /* Spacing */
    --radius: 0.5rem;
    --radius-lg: 1rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
    --shadow-md: 0 4px 6px hsl(0 0% 0% / 0.07);
  }

  .dark {
    --background: 197 64% 29%;
    --foreground: 0 0% 100%;
    /* ... rest of dark tokens ... */
  }
}
```

### Step 3: Standardize the `IIIDButton` approach

Keep `IIIDButton.module.css` — CSS Modules is the right tool for complex, stateful animations like that push-button effect. This is a healthy exception to the Tailwind-first rule.

---

## ❓ Do you need to design CSS tokens?

**You already have a token system — you just need to complete and document it.**

Your `globals.css` already defines semantic tokens (`--background`, `--primary`, `--radius`) mapped via Tailwind config. This is the **shadcn/ui pattern** and it is solid. What's missing:

| Token Category | Status |
|---|---|
| Colors (semantic) | ✅ Done |
| Border radius | ✅ Done |
| Typography scale | ❌ Missing — font sizes are scattered as Tailwind one-offs |
| Spacing scale | ✅ Handled by Tailwind's built-in scale |
| Shadows | ❌ Missing — currently not tokened |
| Animation timing | ❌ Missing — scattered in components |
| Z-index layers | ❌ Missing |

Adding the missing tokens would make your site much more consistent, especially as you add dark mode and multilingual support.

---

## Summary

```
✅ Keep:     Tailwind CSS (primary styling layer)
✅ Keep:     CSS Custom Properties in globals.css (design tokens)
✅ Keep:     CSS Modules for IIIDButton (complex animation exception)
✅ Keep:     shadcn/ui + CVA pattern (great component API)
✅ Keep:     Radix UI primitives (accessibility base)
❌ Remove:   styled-components (runtime overhead + RSC incompatible)
🔧 Extend:   Design token coverage (shadows, typography, z-index, animation)
```
