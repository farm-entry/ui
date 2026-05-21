/**
 * Static source-code regression tests for NAV OData error parsing and drawer UX.
 *
 * Covers three tickets:
 *   TICKET-1 — Backend strips Nav OData prefix before storing message
 *   TICKET-2 — parseNavError helper in dataloadApi.ts
 *   TICKET-3 — ResultsDrawer: scrollable, parsed message column, full-error dialog
 *
 * These tests assert implementation requirements by reading source files directly,
 * without requiring a running browser. Run with:
 *   npx playwright test tests/nav-error-parsing.static.test.ts
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_SRC = path.resolve(__dirname, "../src");
const API_SRC = path.resolve(__dirname, "../../api/src");

function readUi(...parts: string[]): string {
  return fs.readFileSync(path.join(UI_SRC, ...parts), "utf-8");
}

function readApi(...parts: string[]): string {
  return fs.readFileSync(path.join(API_SRC, ...parts), "utf-8");
}

// ---------------------------------------------------------------------------
// TICKET-1 — Backend: DataloadService strips Nav OData prefix
// ---------------------------------------------------------------------------
test.describe("TICKET-1 — DataloadService: strip Nav OData prefix", () => {
  let src: string;
  test.beforeAll(() => {
    src = readApi("services", "DataloadService.ts");
  });

  test("captures raw error string for logging before extraction", () => {
    expect(src).toContain("const raw =");
    expect(src).toContain("logger.warn(`Row ${rowNumber} rejected: ${raw}`)");
  });

  test("uses regex to extract JSON body from Nav OData error string", () => {
    expect(src).toMatch(/raw\.match\(\/Nav OData error! status: \\d\+, message: /);
  });

  test("falls back to raw message for non-Nav errors", () => {
    expect(src).toContain("const message = navMatch ? navMatch[1] : raw");
  });

  test("stores extracted message (not raw) in the result", () => {
    expect(src).toContain("return { rowNumber, status: 'rejected', message }");
  });
});

// ---------------------------------------------------------------------------
// TICKET-2 — Frontend: parseNavError helper
// ---------------------------------------------------------------------------
test.describe("TICKET-2 — dataloadApi: parseNavError helper", () => {
  let src: string;
  test.beforeAll(() => {
    src = readUi("services", "dataloadApi.ts");
  });

  test("exports NavError interface with code and message fields", () => {
    expect(src).toContain("export interface NavError");
    expect(src).toContain("code: string");
    expect(src).toContain("message: string");
  });

  test("exports parseNavError function", () => {
    expect(src).toContain("export function parseNavError");
  });

  test("returns NavError when error.code and error.message are present", () => {
    expect(src).toContain("if (code && msg) return { code, message: msg }");
  });

  test("returns null when JSON is not parseable", () => {
    expect(src).toContain("return null");
    // catch block present for JSON.parse failure
    expect(src).toMatch(/catch\s*\{[\s\S]*?\/\/ not parseable JSON/);
  });
});

// ---------------------------------------------------------------------------
// TICKET-3 — Frontend: ResultsDrawer — scroll, message column, dialog
// ---------------------------------------------------------------------------
test.describe("TICKET-3 — ResultsDrawer: scroll, parsed column, full-error dialog", () => {
  let src: string;
  test.beforeAll(() => {
    src = readUi("pages", "data-post", "ResultsDrawer.tsx");
  });

  test("Drawer PaperProps includes overflowY: auto for vertical scroll", () => {
    expect(src).toContain("overflowY: 'auto'");
  });

  test("imports InfoOutlinedIcon from @mui/icons-material", () => {
    expect(src).toContain("InfoOutlinedIcon");
    expect(src).toContain("@mui/icons-material/InfoOutlined");
  });

  test("imports Dialog and DialogContent from @mui/material", () => {
    expect(src).toContain("Dialog");
    expect(src).toContain("DialogContent");
    expect(src).toContain("DialogTitle");
  });

  test("MessageCell component renders truncated label with ellipsis", () => {
    expect(src).toContain("textOverflow: 'ellipsis'");
    expect(src).toContain("whiteSpace: 'nowrap'");
  });

  test("MessageCell uses parseNavError to extract code and message", () => {
    expect(src).toContain("parseNavError(message)");
    expect(src).toContain("nav.code");
    expect(src).toContain("nav.message");
  });

  test("MessageCell renders an IconButton to open the detail dialog", () => {
    expect(src).toContain("IconButton");
    expect(src).toContain("setOpen(true)");
  });

  test("ErrorDetailDialog renders Code and Message sections for NAV errors", () => {
    expect(src).toContain("ErrorDetailDialog");
    expect(src).toContain(">Code<");
    expect(src).toContain(">Message<");
  });

  test("ErrorDetailDialog renders plain text fallback for non-NAV errors", () => {
    // both branches present
    expect(src).toContain("nav ?");
    expect(src).toContain("{message}");
  });

  test("MessageCell returns null for undefined message — no crash", () => {
    expect(src).toContain("if (!message) return null");
  });

  test("message column uses renderCell, not plain field render", () => {
    expect(src).toMatch(/field:\s*['"]message['"]/);
    expect(src).toContain("renderCell:");
    expect(src).toContain("MessageCell");
  });

  test("parseNavError is imported from dataloadApi", () => {
    expect(src).toContain("parseNavError");
    expect(src).toContain("dataloadApi");
  });
});
