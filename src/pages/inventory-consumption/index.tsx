import * as React from "react";
import { Typography, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CustomFormsLayout from "../../layouts/forms";
import { PageContainer } from "@toolpad/core";
import CustomPageContainer from "../../components/framework/CustomPageContainer";

export default function InventoryConsumptionPage() {
  return (
    <CustomFormsLayout<any>>
      <Typography variant="h4" gutterBottom>
        Welcome!
      </Typography>
      <Typography variant="body1">Track inventory usage and consumption here.</Typography>
    </CustomFormsLayout>
  );
}
