import { ArrowBack, CheckCircle, Home } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { reportLastFormSubmit } from "../analytics";
import CustomHeader from "../components/framework/CustomHeader";
import CustomFormsLayout from "../layouts/forms";
import LEFTNAV_NAVIGATION from "../LeftNavConfig";

interface PostSuccessState {
  formData: Record<string, any>;
  section: string;
}

// Convert field names to readable format
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/\b\w/g, (str) => str.toUpperCase()); // Capitalize each word
};

// Get section routes from LeftNavConfig
const getSectionRoutes = () => {
  const routes: Record<string, string> = {};
  LEFTNAV_NAVIGATION.forEach((nav) => {
    if ("segment" in nav && nav.segment) {
      routes[nav.segment] = `/${nav.segment}`;
    }
  });
  return routes;
};

export default function PostSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    reportLastFormSubmit("success");
  }, []);
  const state = location.state as PostSuccessState;
  const sectionRoutes = getSectionRoutes();

  if (!state?.formData) {
    navigate("/");
    return null;
  }

  const { formData, section } = state;

  const handleBackToSection = () => {
    const sectionRoute = sectionRoutes[section] || "/";
    navigate(sectionRoute);
  };

  const handleHome = () => {
    navigate("/");
  };

  const renderFormFields = () => {
    return Object.entries(formData)
      .filter(([key, value]) => value !== null && value !== "" && !["form", "eventLabel", "healthStatusLabel", "groupLabel", "fromJobLabel", "toJobLabel"].includes(key))
      .map(([key, value]) => {
        const description = formatFieldName(key);
        const labelOverrides: Record<string, string | null | undefined> = {
          event: formData.eventLabel,
          healthStatus: formData.healthStatusLabel,
          group: formData.groupLabel,
          fromJob: formData.fromJobLabel,
          toJob: formData.toJobLabel,
        };
        const displayValue =
          key in labelOverrides && labelOverrides[key]
            ? String(labelOverrides[key])
            : typeof value === "string" || typeof value === "number"
              ? value.toString()
              : JSON.stringify(value);

        return (
          <Box key={key} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {description}:
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue}
            </Typography>
          </Box>
        );
      });
  };

  return (
    <CustomFormsLayout>
      <CustomHeader icon={CheckCircle} title="Form Posted Successfully" />

      <Stack spacing={3}>
        <Typography variant="h6" color="success.main" textAlign="center">
          Your {formData.form.toLowerCase()} form has been posted successfully!
        </Typography>
        <Divider />

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Submitted Data:
          </Typography>
          <Box sx={{ bgcolor: "grey.50", borderRadius: 1, p: 2 }}>{renderFormFields()}</Box>
        </Box>

        <Stack spacing={2} justifyContent="center" sx={{ pt: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBackToSection} size="large">
            Back to {section.replace("-", " ")}
          </Button>
          <Button variant="contained" startIcon={<Home />} onClick={handleHome} size="large">
            Home
          </Button>
        </Stack>
      </Stack>
    </CustomFormsLayout>
  );
}
