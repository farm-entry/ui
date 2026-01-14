import { Assignment } from "@mui/icons-material";
import { Button, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomHeader from "../../../components/framework/CustomHeader";
import CustomFormsLayout from "../../../layouts/forms";
import { ScorecardPage } from "../../../store/types/scorecards";
import ScorecardElementRenderer from "./ScorecardElementRenderer";

interface MultipageFormProps {
  pages: ScorecardPage[];
  onSubmit: (data: any) => void;
}

export default function MultipageForm({ pages, onSubmit }: MultipageFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<Record<string, any>>({
    mode: "onChange",
    defaultValues: {}
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid }
  } = methods;

  const handleNext = async () => {
    // Validate current page before proceeding
    const currentPageElements = pages[activeStep]?.elements || [];
    const fieldsToValidate = currentPageElements.map((element) => element.id);

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && activeStep < pages.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = activeStep === pages.length - 1;

  return (
    <CustomFormsLayout>
      <CustomHeader icon={Assignment} title={pages[activeStep].title} />

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {pages.map((_, index) => (
          <Step key={index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack>
            {/* /* Iterate through each page */}
            {pages[activeStep] && (
              <PageContainer>
                {/* Iterate through each form input in the page */}
                {pages[activeStep].elements.map((element, index) => (
                  <Stack key={element.id}>
                    <ScorecardElementRenderer element={element} elementIndex={index} />
                  </Stack>
                ))}
              </PageContainer>
            )}
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting}
              variant="outlined"
              size="large"
              fullWidth
            >
              Back
            </Button>

            <Button type="submit" variant="contained" size="large" color="primary" fullWidth>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <Button
              onClick={handleNext}
              variant="contained"
              size="large"
              disabled={isLastStep}
              fullWidth
            >
              Next
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </CustomFormsLayout>
  );
}
