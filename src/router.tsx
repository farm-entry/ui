import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { createBrowserRouter, Outlet } from "react-router";
import type { RouteObject } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import RouteGuard from "./components/RouteGuard";
import { useAnalyticsPageView } from "./analytics";
import useDynamicNavigation from "./hooks/useDynamicNavigation";
import CustomDashboardLayout from "./layouts/dashboard";
import DashboardPage from "./pages";
import AdminPage from "./pages/admin";
import FuelPage from "./pages/fuel";
import InventoryConsumptionPage from "./pages/inventory-consumption";
import JobHeaderUpdatesPage from "./pages/job-header-updates";
import LivestockActivityPage from "./pages/livestock-activity";
import GradeOffPage from "./pages/livestock-activity/forms/gradeoff";
import MortalityPage from "./pages/livestock-activity/forms/mortality";
import MovePage from "./pages/livestock-activity/forms/move";
import PurchasePage from "./pages/livestock-activity/forms/purchase";
import QuantityAdjustmentPage from "./pages/livestock-activity/forms/quantityadj";
import WeanPage from "./pages/livestock-activity/forms/wean";
import MaintenancePage from "./pages/maintenance";
import HealthPage from "./pages/health";
import NotFoundPage from "./pages/not-found";
import PostSuccessPage from "./pages/post-success";
import QRScanner from "./pages/qrscanner";
import ScorecardsPage from "./pages/scorecards";
import SignIn from "./pages/signin";
import Settings from "./pages/useroptions/settings";
import DataPostUploadPage from "./pages/data-post";
import DataPostHistoryPage from "./pages/data-post/HistoryPage";
import { customTheme } from "./theme";
import { MAIN_ROUTES, RouteConfig } from "./routes";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const BRANDING = {
  logo: <Logo />,
  title: "Frontline Farms"
};

// Map segment → page component. Add an entry here when adding a new route to MAIN_ROUTES.
const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  "livestock-activity": LivestockActivityPage,
  "move": MovePage,
  "wean": WeanPage,
  "gradeoff": GradeOffPage,
  "mortality": MortalityPage,
  "purchase": PurchasePage,
  "quantityadj": QuantityAdjustmentPage,
  "scorecards": ScorecardsPage,
  "fuel": FuelPage,
  "maintenance": MaintenancePage,
  "inventory-consumption": InventoryConsumptionPage,
  "job-header-updates": JobHeaderUpdatesPage,
  "qrcode": QRScanner,
  "data-post": DataPostUploadPage,
  "upload": DataPostUploadPage,
  "history": DataPostHistoryPage,
};

function buildRouteObjects(routes: RouteConfig[]): RouteObject[] {
  return routes.map(({ segment, children }) => {
    const Component = PAGE_COMPONENTS[segment];
    if (children?.length) {
      return {
        path: segment,
        Component: () => <Outlet />,
        children: [{ path: "", Component }, ...buildRouteObjects(children)]
      };
    }
    return { path: segment, Component };
  });
}

export default function App() {
  const navigation = useDynamicNavigation();
  useAnalyticsPageView();

  return (
    <ReactRouterAppProvider navigation={navigation} branding={BRANDING} theme={customTheme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

export const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: () => (
          <RouteGuard>
            <CustomDashboardLayout />
          </RouteGuard>
        ),
        children: [
          { path: "/", Component: DashboardPage },
          ...buildRouteObjects(MAIN_ROUTES),
          // Routes not in MAIN_ROUTES (no nav entry, no dashboard card)
          { path: "settings", Component: Settings },
          { path: "post-success", Component: PostSuccessPage },
          {
            path: "admin",
            Component: () => (
              <RouteGuard requiredRole="admin">
                <AdminPage />
              </RouteGuard>
            )
          }
        ]
      },
      { path: "login", Component: SignIn },
      { path: "health", Component: HealthPage },
      { path: "*", Component: NotFoundPage }
    ]
  }
]);
