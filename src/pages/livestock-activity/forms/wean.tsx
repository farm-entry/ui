import * as React from "react";
import { Typography, Box } from "@mui/material";
import { SouthEast } from "@mui/icons-material";
import CustomFormsLayout from "../../../layouts/forms";

export default function WeanPage() {
  return (
    <CustomFormsLayout>
      <SouthEast sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Wean Pigs
      </Typography>
      <Typography variant="body1">
        Process weaning of piglets from sows.
      </Typography>
    </CustomFormsLayout>
  );
}
