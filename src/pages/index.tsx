import * as React from "react";
import Typography from "@mui/material/Typography";
import { PageContainer } from "@toolpad/core/PageContainer";
import { StackedButton } from "../components/inputs";

/* 

add the following as options, each should link to their own subpage that we will create later: 

Livestock Activity
Scorecards
Fuel
Maintenance
Inventory Consumption
Job Header Updates

*/

export default function DashboardPage() {
  return (
    <PageContainer>
      <StackedButton
        variant="outlined"
        options={[
          { label: "Livestock Activity", href: "/livestock-activity" },
          { label: "Scorecards", href: "/scorecards" },
          { label: "Fuel", href: "/fuel" },
          { label: "Maintenance", href: "/maintenance" },
          { label: "Inventory Consumption", href: "/inventory-consumption" },
          { label: "Job Header Updates", href: "/job-header-updates" },
        ]}
      />
    </PageContainer>
  );
}
