import { DashboardLayout, DashboardSidebarPageItem } from "@toolpad/core/DashboardLayout";
import type { NavigationPageItem } from "@toolpad/core/AppProvider";
import { useMemo } from "react";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";
import CustomConfirmation from "../components/framework/CustomConfirmation";
import DomainNotice from "../components/framework/DomainNotice";
import ToolbarActions from "../components/framework/ToolbarActions";
import { useDynamicNavigation } from "../hooks/useDynamicNavigation";

export default function CustomDashboardLayout() {
  const { sidebarNav } = useDynamicNavigation();

  const visibleItems = useMemo(() => {
    const map = new Map<string, NavigationPageItem>();
    for (const item of sidebarNav) {
      if ("segment" in item) {
        const seg = (item as NavigationPageItem).segment as string;
        map.set(seg, item as NavigationPageItem);
      }
    }
    return map;
  }, [sidebarNav]);

  return (
    <DashboardLayout
      slots={{ toolbarActions: ToolbarActions, toolbarAccount: AccountMenu }}
      // renderPageItem: bypass Toolpad's ref-keyed WeakMap by providing href explicitly
      renderPageItem={(item, params) => {
        const seg = item.segment as string;
        const sidebarItem = visibleItems.get(seg);
        if (!sidebarItem) return null;

        if (sidebarItem === item) {
          return <DashboardSidebarPageItem item={item} />;
        }

        return <DashboardSidebarPageItem item={sidebarItem} href={`/${seg}`} />;
      }}
    >
      <CustomConfirmation />
      <DomainNotice />
      <Outlet />
    </DashboardLayout>
  );
}
