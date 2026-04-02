import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { reportLastFormSubmit } from "../analytics";

type AlertSeverity = "success" | "info" | "warning" | "error";

interface GlobalAlertState {
  open: boolean;
  severity: AlertSeverity;
  message: string;
  title?: string;

  setAlert: (severity: AlertSeverity, message: string, title?: string) => void;
  clearAlert: () => void;
}

export const useGlobalAlertStore = create<GlobalAlertState>()(
  devtools(
    (set) => ({
      open: false,
      severity: "info",
      message: "",
      title: undefined,

      setAlert: (severity: AlertSeverity, message: string, title?: string) => {
        if (severity === "error") reportLastFormSubmit("failure", message);
        set({ open: true, severity, message, title });
      },

      clearAlert: () => {
        set({ open: false, message: "", title: undefined });
      }
    }),
    { name: "GlobalAlertStore" }
  )
);
