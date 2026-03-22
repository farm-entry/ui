import { QrCode, SwapVert } from "@mui/icons-material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import UpdateIcon from "@mui/icons-material/Update";
import { SvgIconProps } from "@mui/material";
import React from "react";
import BabyBottleIcon from "./assets/BabyBottleIcon";
import WeanIcon from "./assets/WeanIcon";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
export interface RouteConfig {
  segment: string;
  title: string;
  description?: string;
  Icon?: React.ComponentType<SvgIconProps>;
  children?: RouteConfig[];
}

export const MAIN_ROUTES: RouteConfig[] = [
  {
    segment: "livestock-activity",
    title: "Livestock Activity",
    description: "Track and manage livestock activities.",
    Icon: AgricultureIcon,
    children: [
      { segment: "move", title: "Move", Icon: SwapVert },
      { segment: "wean", title: "Wean", Icon: BabyBottleIcon },
      { segment: "gradeoff", title: "Grade Off", Icon: PercentOutlinedIcon },
      { segment: "mortality", title: "Mortality", Icon: HealthAndSafetyOutlinedIcon },
      { segment: "purchase", title: "Purchase", Icon: ShoppingBasketIcon },
      { segment: "quantityadj", title: "Quantity Adjustment", Icon: LibraryAddOutlinedIcon }
    ]
  },
  {
    segment: "scorecards",
    title: "Scorecards",
    description: "View and manage scorecards.",
    Icon: AssessmentIcon
  },
  {
    segment: "fuel",
    title: "Fuel",
    description: "Monitor fuel usage and logs.",
    Icon: LocalGasStationIcon
  },
  {
    segment: "maintenance",
    title: "Maintenance",
    description: "Schedule and review maintenance tasks.",
    Icon: BuildIcon
  },
  {
    segment: "inventory-consumption",
    title: "Inventory Consumption",
    description: "Track inventory consumption and usage.",
    Icon: InventoryIcon
  },
  {
    segment: "job-header-updates",
    title: "Job Header Updates",
    description: "Update job headers and details.",
    Icon: UpdateIcon
  },
  {
    segment: "qrcode",
    title: "QR Scanner",
    Icon: QrCode
  }
];

export function findRouteByPath(pathname: string): RouteConfig | null {
  const segments = pathname.split("/").filter(Boolean);
  let routes = MAIN_ROUTES;
  let found: RouteConfig | null = null;
  for (const segment of segments) {
    const route = routes.find((r) => r.segment === segment);
    if (!route) return null;
    found = route;
    routes = route.children ?? [];
  }
  return found;
}
