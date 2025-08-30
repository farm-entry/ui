import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import DashboardPage from "./pages";
import EmployeesCrudPage from "./pages/employees";
import FormsInput from "./pages/formsinput";
import QRScanner from "./pages/qrscanner";
import LivestockActivityPage from "./pages/livestock-activity";
import ScorecardsPage from "./pages/scorecards";
import FuelPage from "./pages/fuel";
import MaintenancePage from "./pages/maintenance";
import InventoryConsumptionPage from "./pages/inventory-consumption";
import JobHeaderUpdatesPage from "./pages/job-header-updates";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "forms",
            Component: () => <Outlet />,
          },
          {
            path: "livestock-activity",
            Component: LivestockActivityPage,
          },
          {
            path: "scorecards",
            Component: ScorecardsPage,
          },
          {
            path: "fuel",
            Component: FuelPage,
          },
          {
            path: "maintenance",
            Component: MaintenancePage,
          },
          {
            path: "inventory-consumption",
            Component: InventoryConsumptionPage,
          },
          {
            path: "job-header-updates",
            Component: JobHeaderUpdatesPage,
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
