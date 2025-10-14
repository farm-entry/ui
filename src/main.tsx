import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import App from "./App";
import CustomDashboardLayout from "./layouts/dashboard";
import EmployeesCrudPage from "./pages/employees";
import FormsInput from "./pages/formsinput";
import FuelPage from "./pages/fuel";
import InventoryConsumptionPage from "./pages/inventory-consumption";
import JobHeaderUpdatesPage from "./pages/job-header-updates";
import LivestockActivityPage from "./pages/livestock-activity";
import LivestockActivityLayout from "./pages/livestock-activity/layout";
import MovePage from "./pages/livestock-activity/forms/move";
import WeanPage from "./pages/livestock-activity/forms/wean";
import GradeOffPage from "./pages/livestock-activity/forms/gradeoff";
import MortalityPage from "./pages/livestock-activity/forms/mortality";
import PurchasePage from "./pages/livestock-activity/forms/purchase";
import QuantityAdjustmentPage from "./pages/livestock-activity/forms/quantityadj";
import MaintenancePage from "./pages/maintenance";
import QRScanner from "./pages/qrscanner";
import ScorecardsPage from "./pages/scorecards";
import DashboardPage from "./pages";
import CustomFormsLayout from "./layouts/forms";
import RouteGuard from "./components/RouteGuard";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: CustomDashboardLayout,
        children: [
          {
            path: "/",
            Component: DashboardPage,
          },
          {
            path: "livestock-activity",
            Component: () => (
              <RouteGuard requiredRoute="livestock-activity">
                <LivestockActivityLayout />
              </RouteGuard>
            ),
            children: [
              {
                path: "",
                Component: LivestockActivityPage,
              },
              {
                path: "move",
                Component: MovePage,
              },
              {
                path: "wean",
                Component: WeanPage,
              },
              {
                path: "gradeoff",
                Component: GradeOffPage,
              },
              {
                path: "mortality",
                Component: MortalityPage,
              },
              {
                path: "purchase",
                Component: PurchasePage,
              },
              {
                path: "quantityadj",
                Component: QuantityAdjustmentPage,
              },
            ],
          },
          {
            path: "scorecards",
            Component: () => (
              <RouteGuard requiredRoute="scorecards">
                <ScorecardsPage />
              </RouteGuard>
            ),
          },
          {
            path: "fuel",
            Component: () => (
              <RouteGuard requiredRoute="fuel">
                <FuelPage />
              </RouteGuard>
            ),
          },
          {
            path: "maintenance",
            Component: () => (
              <RouteGuard requiredRoute="maintenance">
                <MaintenancePage />
              </RouteGuard>
            ),
          },
          {
            path: "inventory-consumption",
            Component: () => (
              <RouteGuard requiredRoute="inventory-consumption">
                <InventoryConsumptionPage />
              </RouteGuard>
            ),
          },
          {
            path: "job-header-updates",
            Component: () => (
              <RouteGuard requiredRoute="job-header-updates">
                <JobHeaderUpdatesPage />
              </RouteGuard>
            ),
          },
          {
            path: "forminputs",
            Component: FormsInput,
          },
          {
            path: "employees/:employeeId?/*",
            Component: EmployeesCrudPage,
          },
          {
            path: "qrcode",
            Component: QRScanner,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
