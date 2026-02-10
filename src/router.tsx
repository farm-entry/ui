import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { createBrowserRouter, Outlet } from "react-router";
import frontlineLogo from "./assets/frontlinesprout.svg";
import RouteGuard from "./components/RouteGuard";
import useDynamicNavigation from "./hooks/useDynamicNavigation";
import { AuthProvider } from "./layouts/authContext";
import CustomDashboardLayout from "./layouts/dashboard";
import LEFTNAV_NAVIGATION from "./LeftNavConfig";
import DashboardPage from "./pages";
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
import LivestockActivityLayout from "./pages/livestock-activity/layout";
import MaintenancePage from "./pages/maintenance";
import NotFoundPage from "./pages/not-found";
import PostSuccessPage from "./pages/post-success";
import QRScanner from "./pages/qrscanner";
import ScorecardsPage from "./pages/scorecards";
import SignIn from "./pages/signin";
import { customTheme } from "./theme";

const Logo = () => <img src={frontlineLogo} alt="Frontline Farms Logo" />;

const BRANDING = {
  logo: <Logo />,
  title: "Frontline Farms"
};

export default function App() {
  const navigation = useDynamicNavigation(LEFTNAV_NAVIGATION);

  return (
    <ReactRouterAppProvider navigation={navigation} branding={BRANDING} theme={customTheme}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
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
          {
            path: "/",
            Component: DashboardPage
          },
          {
            path: "livestock-activity",
            Component: LivestockActivityLayout,
            handle: {
              title: "Livestock Activity"
            },
            children: [
              {
                path: "",
                Component: LivestockActivityPage,
                handle: {
                  title: "Overview"
                }
              },
              {
                path: "move",
                Component: MovePage,
                handle: {
                  title: "Move Livestock"
                }
              },
              {
                path: "wean",
                Component: WeanPage,
                handle: {
                  title: "Wean Pigs"
                }
              },
              {
                path: "gradeoff",
                Component: GradeOffPage,
                handle: {
                  title: "Grade Off"
                }
              },
              {
                path: "mortality",
                Component: MortalityPage,
                handle: {
                  title: "Mortality"
                }
              },
              {
                path: "purchase",
                Component: PurchasePage,
                handle: {
                  title: "Purchase Livestock"
                }
              },
              {
                path: "quantityadj",
                Component: QuantityAdjustmentPage,
                handle: {
                  title: "Quantity Adjustment"
                }
              }
            ]
          },
          {
            path: "scorecards",
            Component: ScorecardsPage
          },
          {
            path: "fuel",
            Component: FuelPage
          },
          {
            path: "maintenance",
            Component: MaintenancePage
          },
          {
            path: "inventory-consumption",
            Component: InventoryConsumptionPage
          },
          {
            path: "job-header-updates",
            Component: JobHeaderUpdatesPage
          },
          {
            path: "qrcode",
            Component: QRScanner
          },
          {
            path: "post-success",
            Component: PostSuccessPage
          }
        ]
      },
      {
        path: "login",
        Component: SignIn
      },
      {
        path: "*",
        Component: NotFoundPage
      }
    ]
  }
]);
