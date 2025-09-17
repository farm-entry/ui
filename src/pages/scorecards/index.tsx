import * as React from "react";
import { Typography, Box } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CustomFormsLayout from "../../layouts/forms";

export default function ScorecardsPage() {
  return (
    <CustomFormsLayout>
      <AssessmentIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Scorecards Page
      </Typography>
      <Typography variant="body1">
        View and manage your scorecards here.
      </Typography>
    </CustomFormsLayout>
  );
}
