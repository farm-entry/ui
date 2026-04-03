import { useEffect } from "react";
import { recordFormOpen } from "./analytics";

export function useFormAnalytics(formName: string): void {
  useEffect(() => {
    recordFormOpen(formName);
  }, [formName]);
}
