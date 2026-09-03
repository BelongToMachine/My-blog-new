import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.A11Y_BASE_URL ?? "http://127.0.0.1:3000"

export default defineConfig({
  testDir: "./tests/a11y",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    colorScheme: "light",
    trace: "on-first-retry",
  },
  webServer: process.env.A11Y_BASE_URL
    ? undefined
    : {
        command: "bun dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
