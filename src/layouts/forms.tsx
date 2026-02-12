import { Box, Card, Container, Link, Tooltip } from "@mui/material";
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Tooltip title="Exit">
          <Link onClick={handleExit} aria-label="exit">
            Exit
          </Link>
        </Tooltip> 
      </Box>
      <Card variant="outlined" sx={{ mt: 0, mb: 2, p: 2 }}>
        {children}
      </Card>
      <CustomConfirmation />
    </Container>
  );
}
