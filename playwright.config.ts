import { defineConfig, devices } from "@playwright/test";
import * as path from "path";

const AUTH_STATE_PATH = path.resolve("./test-results/auth-state.json");

/**
 * Playwright configuration for FarmEntry UI regression tests.
 * Tests run against a locally-served production build (npm run build && npm run start)
 * or the dev server (npm run dev).
 *
 * Authentication is handled by globalSetup which logs in once and saves
 * storage state to disk. Tests restore this state to avoid repeated
 * login requests that would trigger the API rate limiter (10 req / 15 min).
 *
 * To run: npx playwright test
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./tests/setup/global-setup.ts",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    headless: true,
    storageState: AUTH_STATE_PATH,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
});
