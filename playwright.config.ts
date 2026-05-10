import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for FarmEntry UI regression tests.
 * Tests run against a locally-served production build (npm run build && npm run start)
 * or the dev server (npm run dev).
 *
 * To run: npx playwright test
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
