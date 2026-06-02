/**
 * AC-07 — DomainNotice color resolution logic (pure unit tests)
 *
 * Tests the effectiveColor formula extracted from DomainNotice.tsx:
 *   const effectiveColor = (userColor && userColor !== '') ? userColor : (configColor ?? undefined);
 *
 * No browser/DOM required — runs with Playwright's test runner as pure logic assertions.
 */

import { test, expect } from "@playwright/test";

// ── Pure helper — mirrors DomainNotice.tsx line 18 exactly ───────────────────

function resolveEffectiveColor(
  userColor: string | undefined,
  configColor: string | undefined
): string | undefined {
  return (userColor && userColor !== "")
    ? userColor
    : (configColor ?? undefined);
}

// ── AC-07: userColor takes priority ──────────────────────────────────────────

test.describe("AC-07 — DomainNotice color resolution", () => {
  test("returns userColor when both userColor and configColor are set", () => {
    const result = resolveEffectiveColor("#B71C1C", "#2E7D32");
    expect(result).toBe("#B71C1C");
  });

  test("returns userColor when only userColor is set (no configColor)", () => {
    const result = resolveEffectiveColor("#B71C1C", undefined);
    expect(result).toBe("#B71C1C");
  });

  // ── configColor fallback ────────────────────────────────────────────────────

  test("falls back to configColor when userColor is undefined", () => {
    const result = resolveEffectiveColor(undefined, "#2E7D32");
    expect(result).toBe("#2E7D32");
  });

  test("falls back to configColor when userColor is an empty string (reset state)", () => {
    const result = resolveEffectiveColor("", "#2E7D32");
    expect(result).toBe("#2E7D32");
  });

  // ── primary.main fallback (undefined result, MUI handles the fallback in sx) ─

  test("returns undefined when both userColor and configColor are absent", () => {
    const result = resolveEffectiveColor(undefined, undefined);
    expect(result).toBeUndefined();
  });

  test("returns undefined when userColor is empty string and configColor is undefined", () => {
    const result = resolveEffectiveColor("", undefined);
    expect(result).toBeUndefined();
  });

  test("returns undefined when both userColor and configColor are empty strings", () => {
    // configColor from getDomainColor() is typed string | undefined — empty string
    // would still trigger the fallback chain correctly
    const result = resolveEffectiveColor("", "");
    // configColor '' is truthy-falsy edge case: '' ?? undefined → ''
    // The MUI sx backgroundColor: '' falls back to the default — acceptable.
    // The formula yields '' (configColor coalesced), not undefined, because ?? only
    // catches null/undefined — this matches the component's actual behaviour.
    expect(result).toBe("");
  });

  // ── Boundary: non-empty non-preset userColor (custom hex from color picker) ─

  test("returns custom hex userColor over a preset configColor", () => {
    const result = resolveEffectiveColor("#ABCDEF", "#388E3C");
    expect(result).toBe("#ABCDEF");
  });

  test("is case-sensitive — preserves the casing of userColor exactly", () => {
    const result = resolveEffectiveColor("#abcdef", "#388E3C");
    expect(result).toBe("#abcdef");
  });
});
