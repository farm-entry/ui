import * as React from "react";
import { Typography, Box } from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

export default function FuelPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <LocalGasStationIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Fuel Page
      </Typography>
      <Typography variant="body1">Monitor and record fuel usage here.</Typography>
    </Box>
  );
}
