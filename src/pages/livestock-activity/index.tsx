import * as React from "react";
import { Typography, Box } from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture";

export default function LivestockActivityPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <AgricultureIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Livestock Activity Page
      </Typography>
      <Typography variant="body1">Track and manage your livestock activities here.</Typography>
    </Box>
  );
}
