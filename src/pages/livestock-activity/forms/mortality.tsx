import * as React from "react";
import { Typography, Box } from "@mui/material";
import { ReportProblem } from "@mui/icons-material";
import CustomFormsLayout from "../../../layouts/forms";

export default function MortalityPage() {
  return (
    <CustomFormsLayout>
      <ReportProblem sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Mortality
      </Typography>
      <Typography variant="body1">
        Record livestock mortality and health issues.
      </Typography>
    </CustomFormsLayout>
  );
}
