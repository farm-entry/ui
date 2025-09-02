import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";

export default function CustomDashboardLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
