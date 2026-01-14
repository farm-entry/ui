import React from "react";
import { scorecardPages } from "../../mock";
import { ScorecardPages } from "../../store/types/scorecards";
import ScorecardMultipageForm from "./components/ScorecardMultipageForm";
import { Box, Alert, Snackbar } from "@mui/material";

export default function ScorecardsPage() {
  const [submitStatus, setSubmitStatus] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const scorecardData = scorecardPages as ScorecardPages;

  const handleFormSubmit = async (formData: any) => {
    try {
      // Here you would typically send the data to your API
      console.log("Submitting scorecard data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSubmitStatus({
        open: true,
        message: "Scorecard submitted successfully!",
        severity: "success"
      });

      // Optionally redirect or reset form
      // navigate('/scorecards/success');
    } catch (error) {
      console.error("Error submitting scorecard:", error);
      setSubmitStatus({
        open: true,
        message: "Failed to submit scorecard. Please try again.",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <ScorecardMultipageForm pages={scorecardData} onSubmit={handleFormSubmit} />

      <Snackbar
        open={submitStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={submitStatus.severity}
          sx={{ width: "100%" }}
        >
          {submitStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}