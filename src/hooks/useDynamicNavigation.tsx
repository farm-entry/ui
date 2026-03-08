import { AdminPanelSettings, ManageAccounts } from "@mui/icons-material";
import type { Navigation } from "@toolpad/core/AppProvider";
import { useMemo } from "react";
import { useUserStore } from "../store/userStore";
import LEFTNAV_NAVIGATION from "../LeftNavConfig";

// Items visible to every authenticated user.
// If the user has menuOptions set, only show segments that appear there.
function getDefaultNav(menuOptions: { segment: string; hidden: boolean }[]): Navigation {
  if (menuOptions.length === 0) return LEFTNAV_NAVIGATION;
  const allowed = new Set(menuOptions.filter((o) => !o.hidden).map((o) => o.segment));
  return LEFTNAV_NAVIGATION.filter(
    (item) => !("segment" in item) || allowed.has(item.segment as string)
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
  const { firstName, username, email, role, menuOptions } = useUserStore();

  return useMemo(() => {
    const displayName = firstName || username || email || "";
    const header: Navigation = [
      { kind: "header", title: `Welcome${displayName && ", " + displayName}!` }
    ];
    const defaultNav = getDefaultNav(menuOptions || []);

    if (role === "app_admin") {
      return [...header, ...defaultNav, ...APP_ADMIN_NAV];
    }

    if (role === "admin") {
      return [...header, ...defaultNav, ...ADMIN_NAV];
    }

    return [...header, ...defaultNav];
  }, [firstName, username, email, role, menuOptions]);
};

export default useDynamicNavigation;
