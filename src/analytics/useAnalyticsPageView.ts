import { useEffect } from "react";
import { useLocation } from "react-router";
import { trackPageView } from "./analytics";

export function useAnalyticsPageView(): void {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname, document.title);
  }, [pathname]);
}
