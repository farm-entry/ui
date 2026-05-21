import type { NavigationPageItem } from "@toolpad/core/AppProvider";
import { MAIN_ROUTES, RouteConfig } from "../routes";
import { useDynamicNavigation } from "./useDynamicNavigation";

/**
 * Returns the subset of MAIN_ROUTES that are currently visible in the side nav.
 * Applies the same menuOptions + filter logic as useDynamicNavigation so the
 * home page and nav stay in sync.
 */
export function useVisibleRoutes(): RouteConfig[] {
  const { sidebarNav } = useDynamicNavigation();

  const visibleSegments = new Set(
    sidebarNav
      .filter((item): item is NavigationPageItem => "segment" in item)
      .map((item) => item.segment as string)
  );

  return MAIN_ROUTES.filter((r) => r.description && visibleSegments.has(r.segment));
}
