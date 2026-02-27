import * as React from "react";
import { Typography, Box } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import CustomFormsLayout from "../../layouts/forms";
import { PageContainer } from "@toolpad/core";

export default function JobHeaderUpdatesPage() {
  return (
    <PageContainer>
      <CustomFormsLayout>
        <UpdateIcon sx={{ fontSize: 64, mb: 2 }} color="primary" />
        <Typography variant="h4" gutterBottom>
          Welcome to the Job Header Updates Page
        </Typography>
        <Typography variant="body1">Manage and update job headers here.</Typography>
      </CustomFormsLayout>
    </PageContainer>
  );
}
