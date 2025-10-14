import * as React from "react";
import { Typography, Box } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import CustomFormsLayout from "../../../layouts/forms";

export default function PurchasePage() {
  return (
    <CustomFormsLayout>
      <ShoppingCart sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Purchase Livestock
      </Typography>
      <Typography variant="body1">
        Add new livestock purchases to inventory.
      </Typography>
    </CustomFormsLayout>
  );
}
