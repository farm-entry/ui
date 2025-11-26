import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";

export default function CustomDashboardLayout() {
  return (
    <DashboardLayout slots={{ toolbarAccount: () => <AccountMenu /> }}>
      <Outlet />
    </DashboardLayout>
  );
}
