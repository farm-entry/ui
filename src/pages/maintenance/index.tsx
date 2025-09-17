import * as React from "react";
import { Typography, Box } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CustomFormsLayout from "../../layouts/forms";

export default function MaintenancePage() {
  return (
    <CustomFormsLayout>
      <BuildCircleIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Maintenance Page
      </Typography>
      <Typography variant="body1">
        Schedule and track maintenance tasks here.
      </Typography>
    </CustomFormsLayout>
  );
}
