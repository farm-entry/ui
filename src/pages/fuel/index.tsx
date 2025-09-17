import * as React from "react";
import { Typography, Box } from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import CustomFormsLayout from "../../layouts/forms";

export default function FuelPage() {
  return (
    <CustomFormsLayout>
      <LocalGasStationIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Fuel Page
      </Typography>
      <Typography variant="body1">
        Monitor and record fuel usage here.
      </Typography>
    </CustomFormsLayout>
  );
}
