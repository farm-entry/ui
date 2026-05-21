import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";
import CustomConfirmation from "../components/framework/CustomConfirmation";
import DomainNotice from "../components/framework/DomainNotice";
import ToolbarActions from "../components/framework/ToolbarActions";
import { useDynamicNavigation } from "../hooks/useDynamicNavigation";

export default function CustomDashboardLayout() {
  const { sidebarNav } = useDynamicNavigation();

  return (
    <DashboardLayout
      navigation={sidebarNav}
      slots={{ toolbarActions: ToolbarActions, toolbarAccount: AccountMenu }}
    >
      <CustomConfirmation />
      <DomainNotice />
      <Outlet />
    </DashboardLayout>
  );
}
