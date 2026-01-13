import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";
import AccountMenu from "../components/framework/AccountMenu";
import GlobalAlert from "../components/framework/GlobalAlert";
import { Box } from "@mui/material";

export default function CustomDashboardLayout() {
  return (
    <DashboardLayout slots={{ toolbarAccount: () => <AccountMenu /> }}>
      <Box>
        <GlobalAlert />
        <Outlet />
      </Box>
    </DashboardLayout>
  );
}
