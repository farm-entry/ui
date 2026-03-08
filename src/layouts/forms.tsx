import { Box, Button, Card, Container, Link, Stack, Tooltip } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router";
import CustomConfirmation from "../components/framework/CustomConfirmation";
import { useConfirmationStore } from "../store/confirmationStore";

// This is meant to be used as a subset of the dashboard layout
// It wraps all forms and standardizes screen size, putting each form component into a card.

export default function CustomFormsLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const showConfirmation = useConfirmationStore((state) => state.showConfirmation);

  const handleExit = () => {
    showConfirmation(
      "Are you sure?",
      "Do you want to exit this form? Any unsaved changes will be lost.",
      () => navigate("/")
    );
  };

  return (
    <Container>
      {/* <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ my: 1 }}>
        <Button variant="text" color="primary" onClick={handleExit}>
          Exit
        </Button>
      </Stack> */}
      <Card variant="outlined" sx={{ mt: 0, mb: 2, p: 2 }}>
        {children}
      </Card>
      <CustomConfirmation />
      {/* <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Tooltip title="Exit">
          <Button variant="text" color="primary" fullWidth onClick={handleExit}>
            Cancel
          </Button>
        </Tooltip>
      </Stack> */}
    </Container>
  );
}
