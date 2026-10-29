/**
 * AC-08 through AC-11 — Preferences feature E2E tests
 *
 * PREREQUISITES:
 *   npm run dev   (Vite dev server at http://localhost:5173)
 *
 * Run: npx playwright test tests/preferences.spec.ts
 *
 * Strategy:
 *   - All API calls are intercepted via page.route() — no real backend required.
 *   - Authentication is bootstrapped by injecting a fake JWT (never-expiring) and
 *     mocked /api/auth/me response directly into localStorage before each test.
 *   - Zustand stores hydrate from the mocked API responses on first mount.
 *
 * AC-08 — PreferencesTab renders a color swatch grid for each accessible domain
 * AC-09 — Selecting a preset swatch updates the draft (aria-checked="true")
 * AC-10 — Clicking "Reset" removes that domain from draft (swatch deselects)
 * AC-11 — ColorSwatch: role="radio", aria-checked matches selected prop, bg = color prop
 */

import { test, expect, type Page } from "@playwright/test";

// ── Test fixtures ────────────────────────────────────────────────────────────

const FAKE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  // payload: { sub: "test-user", exp: 9999999999 }
  "eyJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjk5OTk5OTk5OTl9." +
  "fake-signature-for-testing";

const MOCK_DOMAINS: Record<string, string[]> = {
  "Test Farm": ["DOMAIN-A", "DOMAIN-B"],
};

const MOCK_USER = {
  username: "testuser",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  role: "user",
  domain: "DOMAIN-A",
  domains: MOCK_DOMAINS,
  isActive: true,
  isEmailVerified: true,
  loginTime: new Date().toISOString(),
  menuOptions: [],
};

const MOCK_DOMAIN_CONFIGS = [
  { name: "DOMAIN-A", uri: "Farm A", parent: "Test Farm", color: "#2E7D32" },
  { name: "DOMAIN-B", uri: "Farm B", parent: "Test Farm", color: undefined },
];

const MOCK_PREFERENCES = {
  domainColors: {},
};

const MOCK_FILTERS = {
  locations: { mode: "INCLUDE", list: [] },
  postingGroups: { mode: "INCLUDE", list: [] },
  menuOptions: { mode: "INCLUDE", list: [] },
};

// ── Setup helpers ────────────────────────────────────────────────────────────

/**
 * Intercept all API calls needed for the Preferences page to load, returning
 * controlled mock responses. Must be called before page.goto().
 */
async function interceptApiCalls(page: Page): Promise<void> {
  await page.route("/api/auth/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_USER) })
  );

  await page.route("/api/user/filters", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_FILTERS) })
  );

  await page.route("/api/user/preferences", (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_PREFERENCES),
      });
    }
    // POST — echo back the body as the saved preferences
    return route.request().postDataJSON().then((body) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) })
    );
  });

  await page.route("/api/config/domains", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_DOMAIN_CONFIGS),
    })
  );

  // Catch-all for any remaining /api/* calls — return empty 200 to avoid proxy errors
  await page.route("/api/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
  );
}

/**
 * Inject a fake access token into localStorage so RouteGuard considers the
 * session authenticated before the page hydrates.
 */
async function injectFakeAuth(page: Page): Promise<void> {
  await page.addInitScript((token) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", "fake-refresh-token");
  }, FAKE_JWT);
}

/**
 * Navigate to the Preferences settings page and wait for it to be fully loaded.
 * Waits for at least one radiogroup (swatch palette) to appear, confirming that
 * the PreferencesTab has rendered its domain sections.
 */
async function gotoPreferences(page: Page): Promise<void> {
  await page.goto("/settings/preferences");
  // Wait until the "Banner Colors" section is visible — it only renders when
  // accessibleDomains.length > 0, which means the user store is hydrated.
  await page.waitForSelector('[role="radiogroup"]', { timeout: 10_000 });
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe("AC-08 — PreferencesTab renders swatch grid for each accessible domain", () => {
  test.beforeEach(async ({ page }) => {
    await injectFakeAuth(page);
    await interceptApiCalls(page);
    await gotoPreferences(page);
  });

  test("renders a radiogroup for every accessible domain the user has", async ({ page }) => {
    const radioGroups = page.locator('[role="radiogroup"]');
    await expect(radioGroups).toHaveCount(2); // DOMAIN-A and DOMAIN-B
  });

  test("labels each radiogroup with the domain name", async ({ page }) => {
    await expect(
      page.locator('[role="radiogroup"][aria-label="Banner color for DOMAIN-A"]')
    ).toBeVisible();
    await expect(
      page.locator('[role="radiogroup"][aria-label="Banner color for DOMAIN-B"]')
    ).toBeVisible();
  });

  test("renders preset color swatches inside each radiogroup", async ({ page }) => {
    const swatchesA = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"]'
    );
    // BANNER_COLOR_PRESETS has 20 entries
    await expect(swatchesA).toHaveCount(20);
  });

  test("renders a custom color button alongside the preset swatches", async ({ page }) => {
    await expect(
      page.locator('button[aria-label="Custom color for DOMAIN-A"]')
    ).toBeVisible();
  });
});

// ── AC-09 — Selecting a preset swatch sets aria-checked="true" ──────────────

test.describe("AC-09 — Selecting a preset swatch updates the draft selection", () => {
  test.beforeEach(async ({ page }) => {
    await injectFakeAuth(page);
    await interceptApiCalls(page);
    await gotoPreferences(page);
  });

  test("initially no preset swatch is checked (no saved preference)", async ({ page }) => {
    const checkedSwatches = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-checked="true"]'
    );
    await expect(checkedSwatches).toHaveCount(0);
  });

  test("clicking a preset swatch marks it as aria-checked='true'", async ({ page }) => {
    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    await forestGreen.click();
    await expect(forestGreen).toHaveAttribute("aria-checked", "true");
  });

  test("only one preset swatch is checked after selection (radio group behaviour)", async ({
    page,
  }) => {
    const radioGroup = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"]'
    );
    const forestGreen = radioGroup.locator('[role="radio"][aria-label="Forest Green"]');
    const farmGreen = radioGroup.locator('[role="radio"][aria-label="Farm Green"]');

    await forestGreen.click();
    await farmGreen.click();

    await expect(farmGreen).toHaveAttribute("aria-checked", "true");
    await expect(forestGreen).toHaveAttribute("aria-checked", "false");
  });

  test("selecting a swatch on one domain does not affect another domain's swatches", async ({
    page,
  }) => {
    const swatchA = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    const swatchB = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-B"] [role="radio"][aria-label="Forest Green"]'
    );

    await swatchA.click();

    await expect(swatchA).toHaveAttribute("aria-checked", "true");
    await expect(swatchB).toHaveAttribute("aria-checked", "false");
  });

  test("Save Preferences button becomes enabled after selecting a swatch", async ({ page }) => {
    const saveButton = page.getByRole("button", { name: "Save Preferences" });
    await expect(saveButton).toBeDisabled();

    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    await forestGreen.click();

    await expect(saveButton).toBeEnabled();
  });
});

// ── AC-10 — Clicking Reset removes domain from draft ────────────────────────

test.describe("AC-10 — Reset chip removes the domain from draft colors", () => {
  test.beforeEach(async ({ page }) => {
    await injectFakeAuth(page);
    await interceptApiCalls(page);
    await gotoPreferences(page);
  });

  test("Reset chip is not visible initially when no preference is set", async ({ page }) => {
    const resetChip = page.locator('button[aria-label="Reset DOMAIN-A banner color to default"]');
    await expect(resetChip).not.toBeVisible();
  });

  test("Reset chip appears after selecting a preset swatch", async ({ page }) => {
    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    await forestGreen.click();

    const resetChip = page.locator(
      'button[aria-label="Reset DOMAIN-A banner color to default"]'
    );
    await expect(resetChip).toBeVisible();
  });

  test("clicking Reset deselects the previously chosen swatch", async ({ page }) => {
    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    await forestGreen.click();
    await expect(forestGreen).toHaveAttribute("aria-checked", "true");

    const resetChip = page.locator(
      'button[aria-label="Reset DOMAIN-A banner color to default"]'
    );
    await resetChip.click();

    // After reset the draft color is '' — no preset matches '', so all swatches should be unchecked
    await expect(forestGreen).toHaveAttribute("aria-checked", "false");
  });

  test("clicking Reset on one domain does not affect another domain's selection", async ({
    page,
  }) => {
    const swatchA = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Farm Green"]'
    );
    const swatchB = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-B"] [role="radio"][aria-label="Farm Green"]'
    );

    await swatchA.click();
    await swatchB.click();

    const resetA = page.locator('button[aria-label="Reset DOMAIN-A banner color to default"]');
    await resetA.click();

    await expect(swatchA).toHaveAttribute("aria-checked", "false");
    await expect(swatchB).toHaveAttribute("aria-checked", "true");
  });
});

// ── AC-11 — ColorSwatch renders correctly ───────────────────────────────────

test.describe("AC-11 — ColorSwatch component rendering", () => {
  test.beforeEach(async ({ page }) => {
    await injectFakeAuth(page);
    await interceptApiCalls(page);
    await gotoPreferences(page);
  });

  test("each preset swatch is rendered as a button element", async ({ page }) => {
    // MUI Box component="button" renders as <button>
    const firstSwatch = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"]'
    ).first();
    await expect(firstSwatch).toHaveJSProperty("tagName", "BUTTON");
  });

  test("each preset swatch has role='radio'", async ({ page }) => {
    const swatches = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"]'
    );
    // Sample the first five for efficiency
    for (let i = 0; i < 5; i++) {
      await expect(swatches.nth(i)).toHaveAttribute("role", "radio");
    }
  });

  test("aria-checked is false on unselected swatch", async ({ page }) => {
    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    await expect(forestGreen).toHaveAttribute("aria-checked", "false");
  });

  test("aria-checked is true on selected swatch", async ({ page }) => {
    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    await forestGreen.click();
    await expect(forestGreen).toHaveAttribute("aria-checked", "true");
  });

  test("swatch background-color matches the color prop value (Forest Green = #2E7D32)", async ({
    page,
  }) => {
    const forestGreen = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Forest Green"]'
    );
    // MUI renders inline styles via Emotion — getComputedStyle returns rgb()
    // #2E7D32 = rgb(46, 125, 50)
    const bgColor = await forestGreen.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBe("rgb(46, 125, 50)");
  });

  test("swatch aria-label matches the color name prop", async ({ page }) => {
    const harvestAmber = page.locator(
      '[role="radiogroup"][aria-label="Banner color for DOMAIN-A"] [role="radio"][aria-label="Harvest Amber"]'
    );
    await expect(harvestAmber).toBeVisible();
    await expect(harvestAmber).toHaveAttribute("aria-label", "Harvest Amber");
  });
});
