import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";
import GlobalAlert from "../components/framework/GlobalAlert";
import ToolbarActions from "../components/framework/ToolbarActions";

export default function CustomDashboardLayout() {
  return (
    <DashboardLayout slots={{ toolbarActions: ToolbarActions, toolbarAccount: AccountMenu }}>
      <GlobalAlert />
      <Outlet />
    </DashboardLayout>
  );
}
