import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation } from "@toolpad/core/AppProvider";
import { FilterList, LockOutlined, PersonOutline } from "@mui/icons-material";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import type { RouteObject } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import RouteGuard from "./components/RouteGuard";
import { useAnalyticsPageView } from "./analytics";
import useDynamicNavigation from "./hooks/useDynamicNavigation";
import CustomDashboardLayout from "./layouts/dashboard";
import SettingsLayout from "./pages/useroptions/settings";
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
import DataPostUploadPage from "./pages/data-post";
import DataPostHistoryPage from "./pages/data-post/HistoryPage";
import { ProfileTab } from "./pages/useroptions/components/ProfileTab";
import { PasswordTab } from "./pages/useroptions/components/PasswordTab";
import { FiltersTab } from "./pages/useroptions/components/FiltersTab";
import { customTheme } from "./theme";
import { MAIN_ROUTES, RouteConfig } from "./routes";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const BRANDING = {
  logo: <Logo />,
  title: "Frontline Farms"
};

const SETTINGS_NAV: Navigation = [
  { kind: "header", title: "Settings" },
  { title: "Profile",  icon: <PersonOutline />,  segment: "settings/profile"  },
  { title: "Password", icon: <LockOutlined />,    segment: "settings/password" },
  { title: "Filters",  icon: <FilterList />,      segment: "settings/filters"  },
];

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
  const { appNav } = useDynamicNavigation();
  useAnalyticsPageView();

  return (
    <ReactRouterAppProvider navigation={appNav} branding={BRANDING} theme={customTheme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

function SettingsApp() {
  useAnalyticsPageView();

  return (
    <ReactRouterAppProvider navigation={SETTINGS_NAV} branding={BRANDING} theme={customTheme}>
      <RouteGuard>
        <SettingsLayout />
      </RouteGuard>
    </ReactRouterAppProvider>
  );
}

export const router = createBrowserRouter([
  // Settings has its own ReactRouterAppProvider so the sidebar shows settings nav.
  // Must come before the pathless App route so /settings/* matches here first.
  {
    path: "settings",
    Component: SettingsApp,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: "profile",  Component: ProfileTab },
      { path: "password", Component: PasswordTab },
      { path: "filters",  Component: FiltersTab },
    ]
  },
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
