declare global {
  function gtag(...args: any[]): void;
  interface Window {
    dataLayer: any[];
    gtag(...args: any[]): void;
  }
}

// Module-level form timing state — safe because only one form is open at a time in this SPA
let _lastFormName = "unknown";
let _lastFormOpenMs = 0;

const guard = (): boolean =>
  typeof window !== "undefined" && typeof window.gtag === "function";

export function initGA(): void {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return; // already initialized

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
}

export function trackPageView(pathname: string, title?: string): void {
  if (!guard()) return;
  window.gtag("event", "page_view", {
    page_path: pathname,
    page_title: title ?? document.title
  });
}

export function recordFormOpen(formName: string): void {
  _lastFormName = formName;
  _lastFormOpenMs = Date.now();
  if (!guard()) return;
  window.gtag("event", "form_open", { form_name: formName });
}

export function reportLastFormSubmit(
  outcome: "success" | "failure",
  errorCode?: string
): void {
  if (!_lastFormOpenMs) return;
  const durationMs = Date.now() - _lastFormOpenMs;
  _lastFormOpenMs = 0; // prevent double-fire
  if (!guard()) return;
  window.gtag("event", "form_submit", {
    form_name: _lastFormName,
    duration_ms: durationMs,
    outcome,
    ...(errorCode ? { error_code: errorCode } : {})
  });
}

export function trackInputFocus(
  fieldName: string,
  formName: string,
  inputType: string
): void {
  if (!guard()) return;
  window.gtag("event", "input_focus", {
    field_name: fieldName,
    form_name: formName,
    input_type: inputType
  });
}

export function trackTypeAheadSelection(
  fieldName: string,
  formName: string,
  method: "typed" | "scrolled"
): void {
  if (!guard()) return;
  window.gtag("event", "typeahead_selection", {
    field_name: fieldName,
    form_name: formName,
    method
  });
}
