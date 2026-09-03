import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const coreRoutes = [
  "/zh",
  "/en",
  "/zh/articles",
  "/en/articles",
  "/zh/contact",
  "/en/contact",
  "/zh/ai",
  "/en/ai",
  "/design-system",
]

const extraRoutes = (process.env.A11Y_ARTICLE_PATHS ?? "")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean)

for (const route of [...coreRoutes, ...extraRoutes]) {
  test(`has no serious or critical axe violations: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(route, { waitUntil: "networkidle" })

    const results = await new AxeBuilder({ page }).analyze()
    const blockingViolations = results.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical",
    )

    expect(blockingViolations).toEqual([])
  })
}
