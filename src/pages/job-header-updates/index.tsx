import * as React from "react";
import { Typography, Box } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";

export default function JobHeaderUpdatesPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <UpdateIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
      <Typography variant="h4" gutterBottom>
        Welcome to the Job Header Updates Page
      </Typography>
      <Typography variant="body1">Manage and update job headers here.</Typography>
    </Box>
  );
}
