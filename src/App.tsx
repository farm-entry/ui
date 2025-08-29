import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ClipboardIcon from "@mui/icons-material/DynamicForm";
import { Outlet } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation } from "@toolpad/core/AppProvider";
import { customTheme } from "./theme";
import frontlineLogo from "./assets/frontlinefarms-logo.svg";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "forminputs",
    title: "Form Inputs",
    icon: <ClipboardIcon />,
    pattern: "forminputs",
  },
  {
    segment: "employees",
    title: "Employees",
    icon: <PersonIcon />,
    pattern: "employees{/:employeeId}*",
  },
];

const BRANDING = {
  logo: <Logo />,
  title: "Frontline Farms",
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={customTheme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
