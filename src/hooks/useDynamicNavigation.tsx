import { AdminPanelSettings, ManageAccounts } from "@mui/icons-material";
import type { Navigation, NavigationPageItem } from "@toolpad/core/AppProvider";
import { useMemo } from "react";
import { useUserStore } from "../store/userStore";
import LEFTNAV_NAVIGATION from "../LeftNavConfig";
import { applyMenuOptionFilter } from "../utils/filterHelpers";
import type {
  FilterCategory,
  FilterMenuOption,
  MenuOption,
} from "../store/types/user";

// Items visible to every authenticated user.
// If the user has menuOptions set, only show segments that appear there.
// Also applies the user's menuOptions filter settings.
function getDefaultNav(
  menuOptions: MenuOption[],
  filter: FilterCategory<FilterMenuOption>,
): Navigation {
  if (menuOptions.length === 0) {
    // No menuOptions configured — apply only the filter against the full nav
    if (filter.list.length === 0) return LEFTNAV_NAVIGATION;
    const pageItems = LEFTNAV_NAVIGATION.filter(
      (item): item is NavigationPageItem =>
        "segment" in item && typeof (item as NavigationPageItem).segment === "string"
    );
    const syntheticOptions: MenuOption[] = pageItems.map((item) => ({
      segment: item.segment as string,
      title: typeof item.title === "string" ? item.title : "",
      hidden: false,
    }));
    const filtered = applyMenuOptionFilter(syntheticOptions, filter);
    if (filtered.length === syntheticOptions.length) return LEFTNAV_NAVIGATION;
    const allowedSegments = new Set(filtered.map((o) => o.segment));
    return LEFTNAV_NAVIGATION.filter(
      (item) =>
        !("segment" in item) || allowedSegments.has((item as NavigationPageItem).segment as string)
    );
  }

  const visibleOptions = menuOptions.filter((o) => !o.hidden);
  const filteredOptions = applyMenuOptionFilter(visibleOptions, filter);
  const allowed = new Set(filteredOptions.map((o) => o.segment));
  return LEFTNAV_NAVIGATION.filter(
    (item) =>
      !("segment" in item) || allowed.has((item as NavigationPageItem).segment as string)
  );
}

// Additional items visible to admin and app_admin roles.
const ADMIN_NAV: Navigation = [
  { kind: "divider" },
  { kind: "header", title: "Administration" },
  {
    title: "User Management",
    icon: <ManageAccounts />,
    segment: "admin"
  }
];

// Additional items visible only to app_admin.
const APP_ADMIN_NAV: Navigation = [
  { kind: "divider" },
  { kind: "header", title: "Administration" },
  {
    title: "Admin Console",
    icon: <AdminPanelSettings />,
    segment: "admin"
  }
];

export const useDynamicNavigation = (): Navigation => {
  const { firstName, username, email, role, menuOptions, filters } = useUserStore();

  return useMemo(() => {
    const displayName = firstName || username || email || "";
    const header: Navigation = [
      { kind: "header", title: `Welcome${displayName && ", " + displayName}!` }
    ];
    const defaultNav = getDefaultNav(menuOptions || [], filters.menuOptions);

    if (role === "app_admin") {
      return [...header, ...defaultNav, ...APP_ADMIN_NAV];
    }

    if (role === "admin") {
      return [...header, ...defaultNav, ...ADMIN_NAV];
    }

    return [...header, ...defaultNav];
  }, [firstName, username, email, role, menuOptions, filters]);
};

export default useDynamicNavigation;
