import { Home, QrCode } from "@mui/icons-material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import UpdateIcon from "@mui/icons-material/Update";
import type { Navigation } from "@toolpad/core/AppProvider";

const LEFTNAV_NAVIGATION: Navigation = [
  {
    title: "Home",
    icon: <Home />,
    segment: ""
  },
  {
    title: "Livestock Activity",
    icon: <AgricultureIcon color="primary" sx={{ fontSize: 21 }} />,
    segment: "livestock-activity"
    // description: "Track and manage livestock activities.",
  },
  {
    title: "Scorecards",
    icon: <AssessmentIcon color="primary" sx={{ fontSize: 21 }} />,
    segment: "scorecards"
    // description: "View and manage scorecards.",
  },
  {
    title: "Fuel",
    icon: <LocalGasStationIcon color="primary" sx={{ fontSize: 21 }} />,
    segment: "fuel"
    // description: "Monitor fuel usage and logs.",
  },
  {
    title: "Maintenance",
    icon: <BuildIcon color="primary" sx={{ fontSize: 21 }} />,
    segment: "maintenance"
    // description: "Schedule and review maintenance tasks.",
  },
  {
    title: "Inventory Consumption",
    icon: <InventoryIcon color="primary" sx={{ fontSize: 21 }} />,
    segment: "inventory-consumption"
    // description: "Track inventory consumption and usage.",
  },
  {
    title: "Job Header Updates",
    icon: <UpdateIcon color="primary" sx={{ fontSize: 21 }} />,
    segment: "job-header-updates"
    // description: "Update job headers and details.",
  },
  {
    segment: "qrcode",
    title: "QR Scanner",
    icon: <QrCode />
  }
];

export default LEFTNAV_NAVIGATION;
