import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { initGA } from "./analytics";
import { router } from "./router";

initGA();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
