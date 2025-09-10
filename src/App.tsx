import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ClipboardIcon from "@mui/icons-material/DynamicForm";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Navigation, Outlet } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import LEFTNAV_NAVIGATION from "./LeftNavConfig";
import { customTheme } from "./theme";
import { ArrowBackOutlined, HouseRounded } from "@mui/icons-material";
import { ROUTE_SEGMENTS } from "./config/constants";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

// const NAVIGATION: Navigation = [
//   {
//     kind: "header",
//     title: "Main items",
//   },
//   {
//     title: "Dashboard",
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: ROUTE_SEGMENTS.COMPONENTS,
//     title: "Components",
//     icon: <WidgetsIcon />,
//     pattern: "components",
//     children: [
//       {
//         segment: ROUTE_SEGMENTS.FORM_INPUTS,
//         title: "Form Inputs",
//         icon: <ClipboardIcon />,
//         pattern: "components/forminputs",
//       },
//       {
//         segment: ROUTE_SEGMENTS.NAVIGATION,
//         title: "Navigation",
//         icon: <ArrowBackOutlined />,
//         pattern: "components/navigation",
//       },
//       {
//         segment: "layout",
//         title: "Layout",
//         icon: <HouseRounded />,
//         pattern: "components/layout",
//       },
//     ],
//   },
//   {
//     segment: ROUTE_SEGMENTS.EMPLOYEES,
//     title: "Employees",
//     icon: <PersonIcon />,
//     pattern: "employees{/:employeeId}*",
//   },
// ];

const BRANDING = {
  logo: <Logo />,
  title: "Frontline Farms",
};

export default function App() {
  return (
    <ReactRouterAppProvider
      navigation={LEFTNAV_NAVIGATION}
      branding={BRANDING}
      theme={customTheme}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
