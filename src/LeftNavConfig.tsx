import { Desk, Home, QrCode } from "@mui/icons-material";
import ClipboardIcon from "@mui/icons-material/DynamicForm";
import PersonIcon from "@mui/icons-material/Person";
import type { Navigation } from "@toolpad/core/AppProvider";

const LEFTNAV_NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Welcome, Sergei!",
  },
  {
    title: "Home",
    icon: <Home />,
    segment: "",
  },
  {
    title: "Farm Entry Forms",
    icon: <Desk />,
    segment: "forms",
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
  },
  {
    segment: "employees",
    title: "Employees",
    icon: <PersonIcon />,
  },
  {
    segment: "qrcode",
    title: "QR Scanner",
    icon: <QrCode />,
  },
];

export default LEFTNAV_NAVIGATION;
