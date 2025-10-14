import * as React from "react";
import { Typography, Box } from "@mui/material";
import { Grade } from "@mui/icons-material";
import CustomFormsLayout from "../../../layouts/forms";

export default function GradeOffPage() {
  return (
    <CustomFormsLayout>
      <Grade sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Grade Off
      </Typography>
      <Typography variant="body1">
        Note livestock by qualities.
      </Typography>
    </CustomFormsLayout>
  );
}
