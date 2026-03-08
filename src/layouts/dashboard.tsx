import { DashboardLayout, ToolbarActions } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";
import GlobalAlert from "../components/framework/GlobalAlert";

export default function CustomDashboardLayout() {
  return (
    <DashboardLayout slots={{ toolbarActions: ToolbarActions, toolbarAccount: AccountMenu }}>
      <GlobalAlert />
      <Outlet />
    </DashboardLayout>
  );
}
