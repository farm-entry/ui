import { Home } from "@mui/icons-material";
import type { Navigation } from "@toolpad/core/AppProvider";
import { MAIN_ROUTES, RouteConfig } from "./routes";

function buildNavigation(routes: RouteConfig[], depth = 0): Navigation {
  const iconSize = depth === 0 ? 21 : 24;
  return routes.map(({ segment, title, Icon, children }) => ({
    segment,
    title,
    icon: Icon ? <Icon color="primary" sx={{ fontSize: iconSize }} /> : undefined,
    ...(children?.length ? { children: buildNavigation(children, depth + 1) } : {})
  }));
}

const LEFTNAV_NAVIGATION: Navigation = [
  { title: "Home", icon: <Home />, segment: "" },
  ...buildNavigation(MAIN_ROUTES)
];

export default LEFTNAV_NAVIGATION;
