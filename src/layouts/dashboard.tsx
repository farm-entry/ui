import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";
import ToolbarActions from "../components/framework/ToolbarActions";
import DomainNotice from "../components/framework/DomainNotice";

export default function CustomDashboardLayout() {
  return (
    <DashboardLayout slots={{ toolbarActions: ToolbarActions, toolbarAccount: AccountMenu }}>
      <DomainNotice />
      <Outlet />
    </DashboardLayout>
  );
}
