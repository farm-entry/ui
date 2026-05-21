import { AdminPanelSettings, ManageAccounts } from "@mui/icons-material";
import type { Navigation, NavigationPageItem } from "@toolpad/core/AppProvider";
import { useMemo } from "react";
import { useUserStore } from "../store/userStore";
import LEFTNAV_NAVIGATION from "../LeftNavConfig";
import type { FilterCategory, FilterMenuOption, MenuOption } from "../store/types/user";

function applyNavFilter(navItems: Navigation, filter: FilterCategory<FilterMenuOption>): Navigation {
  if (filter.list.length === 0) return navItems;

  const filterSet = new Set(filter.list.map((f) => f.segment));
  const passes = (seg: string) =>
    filter.mode === "INCLUDE" ? filterSet.has(seg) : !filterSet.has(seg);

  return navItems.flatMap((item): Navigation => {
    if (!("segment" in item)) return [item];
    const navItem = item as NavigationPageItem;
    const seg = navItem.segment as string;

    if (navItem.children?.length) {
      const keptChildren = navItem.children.filter(
        (c) => !("segment" in c) || passes((c as NavigationPageItem).segment as string)
      );
      return keptChildren.length > 0 ? [{ ...navItem, children: keptChildren }] : [];
    }

    if (!seg) return [item]; // Home (empty segment) always visible
    return passes(seg) ? [item] : [];
  });
}

function buildBaseNav(menuOptions: MenuOption[]): Navigation {
  const visibleSegments = menuOptions.filter((o) => !o.hidden).map((o) => o.segment);
  if (visibleSegments.length === 0) return LEFTNAV_NAVIGATION;

  const allowed = new Set(visibleSegments);
  return LEFTNAV_NAVIGATION.filter((item) => {
    if (!("segment" in item)) return true;
    const seg = (item as NavigationPageItem).segment as string;
    return !seg || allowed.has(seg);
  });
}

const ADMIN_NAV: Navigation = [
  { kind: "divider" },
  { kind: "header", title: "Administration" },
  { title: "User Management", icon: <ManageAccounts />, segment: "admin" }
];

const APP_ADMIN_NAV: Navigation = [
  { kind: "divider" },
  { kind: "header", title: "Administration" },
  { title: "Admin Console", icon: <AdminPanelSettings />, segment: "admin" }
];

function withRoleNav(nav: Navigation, role: string | null): Navigation {
  if (role === "app_admin") return [...nav, ...APP_ADMIN_NAV];
  if (role === "admin") return [...nav, ...ADMIN_NAV];
  return nav;
}

export interface DynamicNavigation {
  /** Full nav scoped to server permissions — pass to ReactRouterAppProvider for title resolution. */
  appNav: Navigation;
  /** Nav with user filter preferences applied — pass to DashboardLayout for sidebar display. */
  sidebarNav: Navigation;
}

export const useDynamicNavigation = (): DynamicNavigation => {
  const { firstName, username, email, role, menuOptions, filters } = useUserStore();

  return useMemo(() => {
    const displayName = firstName || username || email || "";
    const header: Navigation = [{ kind: "header", title: `Welcome${displayName && ", " + displayName}!` }];
    const baseNav = buildBaseNav(menuOptions || []);

    const appNav = [...header, ...withRoleNav(baseNav, role)];
    const sidebarNav = [...header, ...withRoleNav(applyNavFilter(baseNav, filters.menuOptions), role)];

    return { appNav, sidebarNav };
  }, [firstName, username, email, role, menuOptions, filters]);
};

export default useDynamicNavigation;
