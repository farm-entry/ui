import * as React from "react";
import { Typography, Box } from "@mui/material";
import { Tune } from "@mui/icons-material";
import CustomFormsLayout from "../../../layouts/forms";

export default function QuantityAdjustmentPage() {
  return (
    <CustomFormsLayout>
      <Tune sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Quantity Adjustment
      </Typography>
      <Typography variant="body1">
        Adjust livestock counts and inventory numbers.
      </Typography>
    </CustomFormsLayout>
  );
}
