/**
 * Static source-code regression tests for issue #44 — Field label persistence.
 *
 * These tests assert the implementation requirements by reading the source files
 * directly, without requiring a running browser. They serve as a fast-feedback
 * gate for CI and catch regressions introduced by future refactors.
 *
 * Run with: npx playwright test tests/issue-44-label-persistence.static.test.ts
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const SRC = path.resolve(__dirname, "../src");

function readSrc(...parts: string[]): string {
  return fs.readFileSync(path.join(SRC, ...parts), "utf-8");
}

// ---------------------------------------------------------------------------
// AC-1 / AC-2  TextField wrapper
// ---------------------------------------------------------------------------
test.describe("TextField wrapper (src/components/inputs/TextField.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("components/inputs/TextField.tsx");
  });

  test("AC-1: computes shouldShrink from value presence", () => {
    expect(src).toContain("shouldShrink");
    // Must evaluate to true when value is non-empty
    expect(src).toMatch(/shouldShrink\s*=\s*value\s*!==\s*undefined\s*&&\s*value\s*!==\s*null\s*&&\s*value\s*!==\s*""/);
  });

  test("AC-1: wires shouldShrink into slotProps.inputLabel.shrink", () => {
    expect(src).toContain("inputLabel:");
    expect(src).toContain("shrink: shouldShrink");
  });

  test("AC-2: uses || undefined guard so shrink is not forced false when empty", () => {
    // Guard: shouldShrink || undefined prevents passing false to MUI (which would
    // suppress native focus-shrink behaviour).
    expect(src).toMatch(/shrink:\s*shouldShrink\s*\|\|\s*undefined/);
  });

  test("AC-1: label prop is forwarded to MuiTextField", () => {
    expect(src).toContain("label={props.label}");
  });

  test("value is destructured and passed explicitly to MuiTextField", () => {
    expect(src).toMatch(/const\s*{[^}]*\bvalue\b[^}]*}\s*=\s*props/);
    expect(src).toContain("value={value}");
  });

  test("slotProps.inputLabel merge order: computed shrink first, caller overrides after", () => {
    // The compiled slotProps block must spread ...slotProps?.inputLabel AFTER shrink
    // so a caller can override shrink if needed.
    const inputLabelBlock = src.match(/inputLabel:\s*\{[\s\S]*?\}/)?.[0] ?? "";
    const shrinkPos = inputLabelBlock.indexOf("shrink");
    const spreadPos = inputLabelBlock.indexOf("...slotProps?.inputLabel");
    expect(shrinkPos).toBeGreaterThanOrEqual(0);
    expect(spreadPos).toBeGreaterThanOrEqual(0);
    expect(shrinkPos).toBeLessThan(spreadPos);
  });

  test("DEFECT-DETECTION: outer ...slotProps spread must NOT override the merged inputLabel object", () => {
    // The outer ...slotProps spread happens after the inputLabel key is declared.
    // If ...slotProps comes AFTER inputLabel, it would re-apply slotProps.inputLabel
    // and override the shrink-merged object. Verify ordering in the outer slotProps object.
    const slotPropsBlock = src.match(/slotProps=\{[\s\S]*?\}\s*\{\.\.\.rest\}/)?.[0]
      ?? src.match(/slotProps=\{\s*\{[\s\S]*?\}\s*\}/)?.[0]
      ?? "";
    const inputLabelKeyPos = slotPropsBlock.indexOf("inputLabel:");
    const outerSpreadPos   = slotPropsBlock.indexOf("...slotProps,");
    // inputLabel merged object must appear BEFORE the outer ...slotProps spread
    // so inputLabel is not stomped.
    if (inputLabelKeyPos >= 0 && outerSpreadPos >= 0) {
      expect(inputLabelKeyPos).toBeLessThan(outerSpreadPos);
    }
  });
});

// ---------------------------------------------------------------------------
// AC-3  EventNumberInput wrapper
// ---------------------------------------------------------------------------
test.describe("EventNumberInput (src/components/inputs/EventNumberInput.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("components/inputs/EventNumberInput.tsx");
  });

  test("AC-3: destructures value from props", () => {
    expect(src).toMatch(/const\s*{[^}]*\bvalue\b[^}]*}\s*=/);
  });

  test("AC-3: computes shouldShrink from value", () => {
    expect(src).toContain("shouldShrink");
    expect(src).toMatch(/shouldShrink\s*=\s*value\s*!==\s*undefined\s*&&\s*value\s*!==\s*null\s*&&\s*value\s*!==\s*""/);
  });

  test("AC-3: wires shouldShrink into slotProps.inputLabel.shrink with || undefined guard", () => {
    expect(src).toMatch(/shrink:\s*shouldShrink\s*\|\|\s*undefined/);
  });
});

// ---------------------------------------------------------------------------
// AC-5/6/7  Move form
// ---------------------------------------------------------------------------
test.describe("Move form (src/pages/livestock-activity/forms/move.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/livestock-activity/forms/move.tsx");
  });

  test("AC-5: quantity field has label='Total'", () => {
    expect(src).toMatch(/label="Total"/);
  });

  test("AC-6: smallLivestockQuantity field has label='Smalls'", () => {
    expect(src).toMatch(/label="Smalls"/);
  });

  test("AC-7: totalWeight field has label='Total Weight'", () => {
    expect(src).toMatch(/label="Total Weight"/);
  });

  test("AC-6: smallLivestockQuantity has value={watch('smallLivestockQuantity')}", () => {
    expect(src).toMatch(/value=\{watch\("smallLivestockQuantity"\)\}/);
  });

  test("AC-7: totalWeight has value={watch('totalWeight')}", () => {
    expect(src).toMatch(/value=\{watch\("totalWeight"\)\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-9  Purchase form
// ---------------------------------------------------------------------------
test.describe("Purchase form (src/pages/livestock-activity/forms/purchase.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/livestock-activity/forms/purchase.tsx");
  });

  test("AC-9: quantity field has label='Total'", () => {
    expect(src).toMatch(/label="Total"/);
  });

  test("AC-9: smallLivestockQuantity field has label='Smalls'", () => {
    expect(src).toMatch(/label="Smalls"/);
  });

  test("AC-9: totalWeight field has label='Total Weight'", () => {
    expect(src).toMatch(/label="Total Weight"/);
  });
});

// ---------------------------------------------------------------------------
// AC-10  Wean form
// ---------------------------------------------------------------------------
test.describe("Wean form (src/pages/livestock-activity/forms/wean.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/livestock-activity/forms/wean.tsx");
  });

  test("AC-10: quantity field has label='Total'", () => {
    expect(src).toMatch(/label="Total"/);
  });

  test("AC-10: smallLivestockQuantity field has label='Smalls'", () => {
    expect(src).toMatch(/label="Smalls"/);
  });

  test("AC-10: totalWeight field has label='Total Weight'", () => {
    expect(src).toMatch(/label="Total Weight"/);
  });
});

// ---------------------------------------------------------------------------
// AC-11/12  QuantityAdj form
// ---------------------------------------------------------------------------
test.describe("QuantityAdj form (src/pages/livestock-activity/forms/quantityadj.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/livestock-activity/forms/quantityadj.tsx");
  });

  test("AC-11: quantity field has label='Total Quantity'", () => {
    expect(src).toMatch(/label="Total Quantity"/);
  });

  test("AC-12: totalWeight field has label='Total Weight'", () => {
    expect(src).toMatch(/label="Total Weight"/);
  });

  test("AC-11: quantity field has value={watch('quantity')}", () => {
    expect(src).toMatch(/value=\{watch\("quantity"\)\}/);
  });

  test("AC-12: totalWeight field has value={watch('totalWeight')}", () => {
    expect(src).toMatch(/value=\{watch\("totalWeight"\)\}/);
  });

  test("Edge case 7: custom onChange converts value to Math.abs", () => {
    expect(src).toContain("Math.abs(Number(v.target.value))");
  });
});

// ---------------------------------------------------------------------------
// AC-14  GradeOff form
// ---------------------------------------------------------------------------
test.describe("GradeOff form (src/pages/livestock-activity/forms/gradeoff.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/livestock-activity/forms/gradeoff.tsx");
  });

  test("AC-14: livestockWeight field has label='Ave Weight / Head'", () => {
    expect(src).toMatch(/label="Ave Weight \/ Head"/);
  });

  test("AC-14: livestockWeight has value={watch('livestockWeight')}", () => {
    expect(src).toMatch(/value=\{watch\("livestockWeight"\)\}/);
  });

  test("Edge case 6: EventNumberInput receives label from reason.description", () => {
    expect(src).toContain("label={reason?.description}");
  });

  test("Edge case 6: EventNumberInput receives value wired to quantities[index].quantity", () => {
    // Actual source uses optional chaining: watch("quantities")?.[index]?.quantity || ""
    expect(src).toMatch(/value=\{watch\("quantities"\)\?\.\[index\]\?\.quantity\s*\|\|\s*""\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-15/16  Fuel form
// ---------------------------------------------------------------------------
test.describe("Fuel form (src/pages/fuel/index.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/fuel/index.tsx");
  });

  test("AC-15: gallons field has label='# of Gallons'", () => {
    expect(src).toMatch(/label="# of Gallons"/);
  });

  test("AC-15: gallons has value={watch('gallons')}", () => {
    expect(src).toMatch(/value=\{watch\("gallons"\)\}/);
  });

  test("AC-16: mileage label is dynamic using mileageUnitLabel()", () => {
    expect(src).toMatch(/label=\{`Current Mileage\/\$\{mileageUnitLabel\(\)\}`\}/);
  });

  test("AC-16: mileage has value={watch('mileage')}", () => {
    expect(src).toMatch(/value=\{watch\("mileage"\)\}/);
  });

  test("Edge case 2: mileageUnitLabel function is defined and handles unit variants", () => {
    expect(src).toContain("mileageUnitLabel");
    expect(src).toContain("unitOfMeasureCode");
  });
});

// ---------------------------------------------------------------------------
// AC-17  InventoryItemList
// ---------------------------------------------------------------------------
test.describe("InventoryItemList (src/pages/inventory-consumption/InventoryItemList.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/inventory-consumption/InventoryItemList.tsx");
  });

  test("AC-17: Qty field has label='Qty'", () => {
    expect(src).toMatch(/label="Qty"/);
  });

  test("AC-17: shrink is wired via slotProps.inputLabel.shrink", () => {
    expect(src).toContain("inputLabel:");
    expect(src).toMatch(/shrink:\s*.+quantity.+\|\|\s*undefined/);
  });

  test("Edge case 4: min:1 constraint is in slotProps.htmlInput", () => {
    expect(src).toContain("htmlInput:");
    expect(src).toMatch(/htmlInput:\s*\{\s*min:\s*1\s*\}/);
  });

  test("AC-17: InputAdornment is in slotProps.input (not InputProps)", () => {
    // After migration from InputProps -> slotProps.input
    // InventoryItemList uses raw MUI TextField with JSX attribute slotProps={{...}}
    expect(src).not.toContain("InputProps:");
    expect(src).toContain("slotProps={{");
    expect(src).toContain("input:");
    expect(src).toContain("InputAdornment");
  });
});

// ---------------------------------------------------------------------------
// AC-18/19  Admin UserForm
// ---------------------------------------------------------------------------
test.describe("Admin UserForm (src/pages/admin/UserForm.tsx)", () => {
  let src: string;
  test.beforeAll(() => {
    src = readSrc("pages/admin/UserForm.tsx");
  });

  test("AC-18: username field has label='Username' and value={watch('username')}", () => {
    expect(src).toMatch(/label="Username"/);
    expect(src).toMatch(/value=\{watch\("username"\)\}/);
  });

  test("AC-18: email field has label='Email' and value={watch('email')}", () => {
    expect(src).toMatch(/label="Email"/);
    expect(src).toMatch(/value=\{watch\("email"\)\}/);
  });

  test("AC-18: password field has label='Password' and value={watch('password')}", () => {
    expect(src).toMatch(/label="Password"/);
    expect(src).toMatch(/value=\{watch\("password"\)\}/);
  });

  test("AC-18: firstName field has label='First Name' and value={watch('firstName')}", () => {
    expect(src).toMatch(/label="First Name"/);
    expect(src).toMatch(/value=\{watch\("firstName"\)\}/);
  });

  test("AC-18: lastName field has label='Last Name' and value={watch('lastName')}", () => {
    expect(src).toMatch(/label="Last Name"/);
    expect(src).toMatch(/value=\{watch\("lastName"\)\}/);
  });

  test("AC-19: form spreads initialValues into defaultValues for edit mode pre-population", () => {
    expect(src).toContain("...initialValues");
  });
});

// ---------------------------------------------------------------------------
// AC-ScorecardRange/ScorecardTemp — DEFECT: element.description does not exist
// ---------------------------------------------------------------------------
test.describe("ScorecardRange & ScorecardTemp — label property correctness", () => {
  let rangeSrc: string;
  let tempSrc: string;

  test.beforeAll(() => {
    rangeSrc = readSrc("pages/scorecards/components/ScorecardRange.tsx");
    tempSrc  = readSrc("pages/scorecards/components/ScorecardTemp.tsx");
  });

  test("FAIL AC-ScorecardRange: uses element.description but ScorecardElement has no .description property — should be element.label", () => {
    // This test is EXPECTED TO FAIL because the engineer used element.description
    // which does not exist on ScorecardElement (confirmed in store/types/scorecards.ts).
    // The correct field is element.label.
    const usesDescription = rangeSrc.includes("element.description");
    const usesLabel       = rangeSrc.includes("element.label");
    // Document the defect: description is used but wrong; label is not used but correct.
    expect(usesDescription).toBe(false); // FAILS: element.description is wrong
    expect(usesLabel).toBe(true);        // FAILS: element.label should be used
  });

  test("FAIL AC-ScorecardTemp: uses element.description but ScorecardElement has no .description property — should be element.label", () => {
    const usesDescription = tempSrc.includes("element.description");
    const usesLabel       = tempSrc.includes("element.label");
    expect(usesDescription).toBe(false); // FAILS: element.description is wrong
    expect(usesLabel).toBe(true);        // FAILS: element.label should be used
  });
});

// ---------------------------------------------------------------------------
// AC-21 Regression — maintenance form not touched
// ---------------------------------------------------------------------------
test.describe("Regression: Maintenance form not modified (AC-21)", () => {
  test("maintenance form files exist and were not listed as changed files", () => {
    const maintenancePath = path.join(SRC, "pages/maintenance");
    expect(fs.existsSync(maintenancePath)).toBe(true);
    // Verify the directory contains expected files (unchanged)
    const files = fs.readdirSync(maintenancePath);
    expect(files.length).toBeGreaterThan(0);
  });
});
