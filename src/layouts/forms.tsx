import * as React from "react";
import { Outlet } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Container, Card, CardContent, Box } from "@mui/material";

// This is meant to be used as a subset of the dashboard layout
// It wraps all forms and standardizes screen size, putting each form component into a card.

export default function CustomFormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Card variant="outlined" sx={{ mt: 2, mb: 2, p: 2 }}>
        {children}
      </Card>
    </Container>
  );
}
