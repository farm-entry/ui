import { Desk, Home, QrCode } from "@mui/icons-material";
import ClipboardIcon from "@mui/icons-material/DynamicForm";
import PersonIcon from "@mui/icons-material/Person";
import type { Navigation } from "@toolpad/core/AppProvider";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import { customTheme } from "./theme";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Welcome, Sergei!",
  },
  {
    segment: "",
    title: "Home",
    icon: <Home />,
    pattern: "/",
  },
  {
    title: "Forms",
    icon: <Desk />,
    children: [
      { segment: "livestock-activity", title: "Livestock Activity" },
      { segment: "scorecards", title: "Scorecards" },
      { segment: "fuel", title: "Fuel" },
      { segment: "maintenance", title: "Maintenance" },
      { segment: "inventory-consumption", title: "Inventory Consumption" },
      { segment: "job-header-updates", title: "Job Header Updates" },
    ],
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
  {
    segment: "qrcode",
    title: "QR Scanner",
    icon: <QrCode />,
    pattern: "qrcode",
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
