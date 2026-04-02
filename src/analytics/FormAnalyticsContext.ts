import * as React from "react";

export const FormAnalyticsContext = React.createContext<{ formName: string }>({
  formName: "unknown"
});
