import { Error, Home, ArrowBack, Save, ExpandMore } from "@mui/icons-material";
import { 
  Button, 
  Divider, 
  Stack, 
  Typography, 
  Box, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import CustomHeader from "../components/framework/CustomHeader";
import CustomFormsLayout from "../layouts/forms";
import { useFormStorageStore } from "../store/formStorageStore";
import LEFTNAV_NAVIGATION from "../LeftNavConfig";

interface PostErrorState {
  formData: Record<string, any>;
  formType: string;
  section: string;
  error: {
    code?: string;
    message: string;
    details?: string;
  };
}

// Convert field names to readable format
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/\b\w/g, str => str.toUpperCase()); // Capitalize each word
};

// Get section routes from LeftNavConfig
const getSectionRoutes = () => {
  const routes: Record<string, string> = {};
  LEFTNAV_NAVIGATION.forEach(nav => {
    if ('segment' in nav && nav.segment) {
      routes[nav.segment] = `/${nav.segment}`;
    }
  });
  return routes;
};

export default function PostErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PostErrorState;
  const sectionRoutes = getSectionRoutes();
  const { saveForm } = useFormStorageStore();

  if (!state?.formData || !state?.formType || !state?.error) {
    navigate("/");
    return null;
  }

  const { formData, formType, section, error } = state;

  const handleBackToSection = () => {
    const sectionRoute = sectionRoutes[section] || "/";
    navigate(sectionRoute);
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleSaveForm = () => {
    saveForm(formType.toLowerCase(), formData, 48);
    // Show some feedback that the form was saved
    console.log("Form saved for retry later:", formData);
  };

  const renderFormFields = () => {
    return Object.entries(formData)
      .filter(([key, value]) => value !== null && value !== "" && key !== "form")
      .map(([key, value]) => {
        const description = formatFieldName(key);
        const displayValue = typeof value === "string" || typeof value === "number" 
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

  const renderErrorDetails = () => {
    return (
      <Stack spacing={2}>
        {error.code && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              Error Code:
            </Typography>
            <Typography variant="body1" color="error.main" sx={{ fontFamily: "monospace" }}>
              {error.code}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Message:
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error.message}
          </Typography>
        </Box>
        {error.details && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "medium", mb: 1 }}>
              Details:
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                bgcolor: "grey.100", 
                p: 1, 
                borderRadius: 1,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap"
              }}
            >
              {error.details}
            </Typography>
          </Box>
        )}
      </Stack>
    );
  };

  return (
    <h1>HELLO ERROR</h1>
    // <CustomFormsLayout>
    //   <CustomHeader 
    //     icon={Error} 
    //     title="Form Submission Failed" 
    //     iconSx={{ color: "error.main" }}
    //   />
      
    //   <Stack spacing={3}>
    //     <Alert severity="error" sx={{ textAlign: "center" }}>
    //       <Typography variant="h6">
    //         Your {formType.toLowerCase()} form could not be submitted
    //       </Typography>
    //       <Typography variant="body2" sx={{ mt: 1 }}>
    //         You can save your form data to try again later, or go back to make changes.
    //       </Typography>
    //     </Alert>
        
    //     <Accordion>
    //       <AccordionSummary
    //         expandIcon={<ExpandMore />}
    //         aria-controls="error-details-content"
    //         id="error-details-header"
    //       >
    //         <Typography variant="h6" color="error.main">
    //           Error Details
    //         </Typography>
    //       </AccordionSummary>
    //       <AccordionDetails>
    //         <Box sx={{ bgcolor: "error.light", borderRadius: 1, p: 2, opacity: 0.1 }}>
    //           <Box sx={{ bgcolor: "background.paper", borderRadius: 1, p: 2 }}>
    //             {renderErrorDetails()}
    //           </Box>
    //         </Box>
    //       </AccordionDetails>
    //     </Accordion>

    //     <Accordion>
    //       <AccordionSummary
    //         expandIcon={<ExpandMore />}
    //         aria-controls="form-data-content"
    //         id="form-data-header"
    //       >
    //         <Typography variant="h6">
    //           Form Data
    //         </Typography>
    //       </AccordionSummary>
    //       <AccordionDetails>
    //         <Box sx={{ bgcolor: "grey.50", borderRadius: 1, p: 2 }}>
    //           {renderFormFields()}
    //         </Box>
    //       </AccordionDetails>
    //     </Accordion>
        
    //     <Divider />
        
    //     <Stack spacing={2}>
    //       <Button
    //         variant="contained"
    //         startIcon={<Save />}
    //         onClick={handleSaveForm}
    //         size="large"
    //         color="primary"
    //         fullWidth
    //       >
    //         Save Form to Try Again Later
    //       </Button>
          
    //       <Stack direction="row" spacing={2} justifyContent="center">
    //         <Button
    //           variant="outlined"
    //           startIcon={<ArrowBack />}
    //           onClick={handleBackToSection}
    //           size="large"
    //         >
    //           Back to {section.replace("-", " ")}
    //         </Button>
    //         <Button
    //           variant="outlined"
    //           startIcon={<Home />}
    //           onClick={handleHome}
    //           size="large"
    //         >
    //           Home
    //         </Button>
    //       </Stack>
    //     </Stack>
    //   </Stack>
    // </CustomFormsLayout>
  );
}