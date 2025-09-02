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
    segment: "",
    title: "Home",
    icon: <Home />,
    pattern: "/",
  },
  {
    title: "Forms",
    icon: <Desk />,
    children: [
      { segment: "forms/livestock-activity", title: "Livestock Activity" },
      { segment: "forms/scorecards", title: "Scorecards" },
      { segment: "forms/fuel", title: "Fuel" },
      { segment: "forms/maintenance", title: "Maintenance" },
      { segment: "forms/inventory-consumption", title: "Inventory Consumption" },
      { segment: "forms/job-header-updates", title: "Job Header Updates" },
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

export default LEFTNAV_NAVIGATION;
