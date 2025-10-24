import * as React from "react";
import { Typography, Box } from "@mui/material";
import { SwapVert } from "@mui/icons-material";
import CustomFormsLayout from "../../../layouts/forms";

export default function MovePage() {
  return (
    <CustomFormsLayout>
      <SwapVert sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Move Livestock
      </Typography>
    </CustomFormsLayout>
  );
}
