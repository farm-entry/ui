import * as React from "react";
import { Typography, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function InventoryConsumptionPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <InventoryIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Inventory Consumption Page
      </Typography>
      <Typography variant="body1">Track inventory usage and consumption here.</Typography>
    </Box>
  );
}
